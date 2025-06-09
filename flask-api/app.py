from flask import Flask, request, jsonify, send_file
import os
import cv2
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from PIL import Image, ImageChops, ImageEnhance
import piexif
import joblib
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle
from reportlab.platypus.flowables import HRFlowable
from datetime import datetime
import matplotlib.pyplot as plt
import tempfile
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'savedModels', 'train_models.joblib')
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except:
    print("⚠️ Warning: Could not load pre-trained model. Training a new one...")
    model = None

# Define categories (same as in your original code)
categories = {"aadhar-card": 0, "pan-card": 0, "fake-docs": 1}  # 0: Real, 1: Fake

# ====================== HELPER FUNCTIONS ======================

def extract_ela(image_path):
    """Extract Error Level Analysis (ELA) feature."""
    try:
        image = Image.open(image_path).convert("RGB")
        image.save("temp.jpg", "JPEG", quality=90)
        temp_image = Image.open("temp.jpg")
        ela_image = ImageChops.difference(image, temp_image)
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        return max_diff
    except:
        return None

def extract_metadata(image_path):
    """Extract metadata from image."""
    try:
        exif_data = piexif.load(image_path)
        date_time = exif_data["0th"].get(piexif.ImageIFD.DateTime, b'').decode()
        return 1 if date_time else 0
    except:
        return 0

def extract_features(image_path):
    """Extract all features from an image."""
    img = cv2.imread(image_path)
    if img is None:
        return None

    img_resized = cv2.resize(img, (224, 224))  # Resize for consistency
    mean_r, mean_g, mean_b = np.mean(img[:, :, 0]), np.mean(img[:, :, 1]), np.mean(img[:, :, 2])
    std_r, std_g, std_b = np.std(img[:, :, 0]), np.std(img[:, :, 1]), np.std(img[:, :, 2])

    # Extract additional features
    ela_value = extract_ela(image_path)
    metadata_value = extract_metadata(image_path)

    # Flatten pixel values
    img_flatten = img_resized.flatten()[:1024]  # Use first 1024 pixels
    features = np.hstack([mean_r, std_r, mean_g, std_g, mean_b, std_b, ela_value, metadata_value, img_flatten])

    return features

def apply_ela(image_path, quality=90):
    """Apply Error Level Analysis (ELA) to detect forgery."""
    original = Image.open(image_path).convert('RGB')
    temp_path = "temp_compressed.jpg"
    original.save(temp_path, 'JPEG', quality=quality)
    compressed = Image.open(temp_path)

    ela_image = ImageChops.difference(original, compressed)
    extrema = ela_image.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale = 255.0 / max_diff if max_diff else 1
    ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)

    ela_path = "ela_output.png"
    ela_image.save(ela_path)
    return ela_path

def extract_metadata_for_report(image_path):
    """Extract metadata information from the image (if available)."""
    try:
        exif_data = Image.open(image_path)._getexif()
        if exif_data:
            metadata = {
                key: exif_data[key] for key in exif_data if key in [306, 271, 272]  # DateTime, Camera Make & Model
            }
            return metadata if metadata else 0
        return 0
    except:
        return 0

# ====================== API ENDPOINTS ======================

@app.route('/api/verify', methods=['POST'])
def verify_document():
    """Endpoint to verify if a document is forged."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the file temporarily
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    file.save(temp_path)
    
    try:
        # Extract features
        features = extract_features(temp_path)
        if features is None:
            return jsonify({'error': 'Could not process the image'}), 400
        
        # Create feature columns (should match your training data)
        feature_columns = ["mean_r", "std_r", "mean_g", "std_g", "mean_b", "std_b", "ela_value", "metadata_value"] + [f"feat_{i}" for i in range(1024)]
        feature_df = pd.DataFrame([features], columns=feature_columns)
        
        # Predict
        prediction_proba = model.predict_proba(feature_df)[0]
        is_fake = bool(prediction_proba[1] > 0.45)
        result = "Fake Document" if is_fake else "Real Document"
        
        return jsonify({
            'result': result,
            'is_fake': is_fake,
            'probabilities': {
                'real': float(prediction_proba[0]),  # Convert to Python float
                'fake': float(prediction_proba[1])   # Convert to Python float

            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)

@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    """Endpoint to generate a PDF verification report."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Create temp directory
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    file.save(temp_path)
    
    try:
        # Extract features and predict
        features = extract_features(temp_path)
        if features is None:
            return jsonify({'error': 'Could not process the image'}), 400
        
        feature_columns = ["mean_r", "std_r", "mean_g", "std_g", "mean_b", "std_b", "ela_value", "metadata_value"] + [f"feat_{i}" for i in range(1024)]
        feature_df = pd.DataFrame([features], columns=feature_columns)
        prediction_proba = model.predict_proba(feature_df)[0]
        result = "❌ Fake Document" if prediction_proba[1] > 0.45 else "✅ Real Document"
        
        # Generate PDF report
        report_path = os.path.join(temp_dir, "document_verification_report.pdf")
        
        # ===== Report Generation (from your original code) =====
        doc = SimpleDocTemplate(report_path, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)

        is_fake = "❌" in result
        status = "FORGED" if is_fake else "GENUINE"

        styles = getSampleStyleSheet()
        title_style = styles['Title']
        heading_style = styles['Heading1']
        normal_style = styles['Normal']

        section_style = ParagraphStyle(
            'Section',
            parent=styles['Heading2'],
            spaceAfter=12,
            textColor=colors.darkblue
        )

        elements = []

        # Title
        elements.append(Paragraph("Document Verification Report", title_style))
        elements.append(Spacer(1, 0.25*inch))

        # Document Details
        elements.append(Paragraph("Document Details", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))

        data = [
            ["Document Name:", os.path.basename(temp_path)],
            ["Verification Date:", datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
            ["Forgery Status:", status],
            ["Detection Result:", result]
        ]

        # Original Image
        elements.append(Spacer(1, 0.15*inch))
        elements.append(Paragraph("Original Document", section_style))

        img = Image.open(temp_path)
        img_width, img_height = img.size
        aspect_ratio = img_height / img_width
        img_width = 5 * inch
        img_height = img_width * aspect_ratio

        img_path = os.path.join(temp_dir, "original_resized.jpg")
        img.save(img_path)
        elements.append(RLImage(img_path, width=img_width, height=img_height))
        elements.append(Spacer(1, 0.25*inch))

        detail_table = Table(data, colWidths=[2*inch, 3.5*inch])
        detail_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(detail_table)
        elements.append(Spacer(1, 0.25*inch))

        # Prediction Results
        elements.append(Paragraph("Prediction Results", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))

        # Pie Chart
        labels = ["Real", "Fake"]
        plt.figure(figsize=(5, 5))
        plt.pie(prediction_proba, labels=labels, autopct='%1.1f%%',
                colors=['#FF6B6B', '#4ECDC4'], startangle=140,
                wedgeprops={'edgecolor': 'white', 'linewidth': 2})
        plt.title("Forgery Prediction Confidence")
        pie_chart_path = os.path.join(temp_dir, "prediction_pie_chart.png")
        plt.savefig(pie_chart_path, bbox_inches='tight', dpi=150)
        plt.close()

        elements.append(Paragraph(f"Note: According to your model, a document is considered fake if the Real probability is greater than 40%.", normal_style))
        elements.append(Spacer(1, 0.15*inch))
        elements.append(RLImage(pie_chart_path, width=4*inch, height=4*inch))
        elements.append(Spacer(1, 0.15*inch))

        prob_data = [
            ["Prediction", "Confidence"],
            ["Real", f"{prediction_proba[0]:.2%}"],
            ["Fake", f"{prediction_proba[1]:.2%}"]
        ]

        prob_table = Table(prob_data, colWidths=[2*inch, 2*inch])
        prob_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(prob_table)
        elements.append(Spacer(1, 0.25*inch))

        # ELA Analysis
        elements.append(Paragraph("Error Level Analysis (ELA)", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))
        elements.append(Paragraph("ELA highlights differences in compression levels. Areas with higher error levels may indicate manipulation.", normal_style))
        elements.append(Spacer(1, 0.15*inch))

        ela_path = apply_ela(temp_path)
        elements.append(RLImage(ela_path, width=5*inch, height=3*inch))
        elements.append(Spacer(1, 0.25*inch))

        # Metadata
        elements.append(Paragraph("Metadata Information", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))

        metadata = extract_metadata_for_report(temp_path)
        if isinstance(metadata, dict) and metadata:
            metadata_rows = []
            for key, value in metadata.items():
                metadata_rows.append([str(key), str(value)])

            metadata_table = Table(metadata_rows, colWidths=[2*inch, 3.5*inch])
            metadata_table.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
            ]))
            elements.append(metadata_table)
        else:
            elements.append(Paragraph("No metadata found in the image.", normal_style))

        # Conclusion
        elements.append(Spacer(1, 0.25*inch))
        elements.append(Paragraph("Conclusion", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))

        conclusion_text = f"Based on our analysis, this document appears to be {status}."
        elements.append(Paragraph(conclusion_text, normal_style))

        if is_fake:
            elements.append(Paragraph("The document shows signs of digital manipulation. Please review the ELA analysis and prediction probabilities for more details.", normal_style))
        else:
            elements.append(Paragraph("No significant signs of digital manipulation were detected. However, this analysis is not conclusive and should be combined with other verification methods.", normal_style))

        # Disclaimer
        elements.append(Spacer(1, 0.25*inch))
        elements.append(Paragraph("Disclaimer", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.darkblue, spaceAfter=10))
        disclaimer_text = "This report is generated by an automated system and should be used for informational purposes only. The results are based on digital analysis and may not be 100% accurate. For legal or critical verification, please consult with a forensic document examiner."
        elements.append(Paragraph(disclaimer_text, normal_style))

        doc.build(elements)
        # ===== End of Report Generation =====

        return send_file(
            report_path,
            as_attachment=True,
            download_name='document_verification_report.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up temporary files
        # Remove ELA output, compressed, and temp images if they exist
        try:
            ela_path = os.path.join(os.getcwd(), "ela_output.png")
            temp_compressed = os.path.join(os.getcwd(), "temp_compressed.jpg")
            temp_jpg = os.path.join(os.getcwd(), "temp.jpg")
            if os.path.exists(ela_path):
                os.remove(ela_path)
            if os.path.exists(temp_compressed):
                os.remove(temp_compressed)
            if os.path.exists(temp_jpg):
                os.remove(temp_jpg)
            # Remove temp_dir and its contents
            if os.path.exists(temp_dir):
                for f in os.listdir(temp_dir):
                    os.remove(os.path.join(temp_dir, f))
                os.rmdir(temp_dir)
        except Exception:
            pass

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)