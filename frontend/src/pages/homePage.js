import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-slate-200 font-serif">
     
      {/* Hero Section */}
      <main>
        <div className="min-h-screen  bg-cover bg-center bg-[radial-gradient(ellipse_at_top_center,_rgba(0,0,0,0.8),_black)] text-white mx-2 my-2 rounded-xl">
          {/* Animation */}
          <div className="animate-wiggle">
            <img className="absolute left-28 top-28 h-10" src="/image/gray-box.png" alt="img" />
            <img className="absolute right-60 top-80 h-10" src="/image/gray-box.png" alt="img" />
            <img className="absolute left-28 top-96 h-10" src="/image/gray-box.png" alt="img" />
          </div>

          <div className="animate-ziggle">
            <img className="absolute right-28 top-28 h-10" src="/image/gray-box.png" alt="img" />
            <img className="absolute left-40 top-64 h-10" src="/image/gray-box.png" alt="img" />
            <img className="absolute right-28 top-96 h-10" src="/image/gray-box.png" alt="img" />
          </div>

          <div className="grid grid-cols-10 gap-5" style={{ gridAutoRows: 'min-content' }}>
            <div className="justify-center content-center pt-1 bg-white bg-opacity-15 rounded-xl flex space-x-2 col-start-5 col-end-7 h-7 row-start-4">
              <p className="text-white text-sm">Discover all new Dociffy</p>
              <i className="fas fa-arrow-right my-0 p-1 bg-white bg-opacity-5 rounded-lg"></i>
            </div>

            <div className="text-center col-start-3 col-end-9 row-start-5">
              <p className="font-semibold text-4xl">One Tools For Doing it <br /> All Together</p>
            </div>

            <div className="text-center col-start-4 col-end-8 row-start-6 text-sm text-gray-300 font-semibold">
              <p>Dociffy empowers you to achieve accuracy and security at scale by seamlessly linking document verification processes to your organization's compliance and authentication goals.</p>
            </div>

            <button className="row-start-8 col-start-5 bg-white content-center justify-center px-2 py-2 text-black rounded-xl font-bold text-sm">
              <Link to="/register">Get Started</Link>
            </button>
            <button className="row-start-8 col-start-6 col-end-7 bg-black px-2 py-2 text-white rounded-xl font-bold text-sm">
              <a href="#featuresSection">Learn More</a>
            </button>

            <div id="scrollImage" className="col-start-3 col-end-9 row-start-9">
              <img src="/image/videoframe_4770.png" alt="center img" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="featuresSection" className="bg-white rounded-2xl mx-2 my-2 px-20 py-20">
          <div className="flex bg-white text-sm space-x-1 px-5 py-2 w-fit font-bold rounded-xl border shadow-lg">
            <i className="fa-solid fa-gear pt-2" style={{ color: '#2a3447' }}></i>
            <p className="text-gray-700 text-lg">Features</p>
          </div>

          <p className="text-2xl mt-5 font-semibold text-gray-700">Everything Your Looking For</p>

          <div className="flex pt-20 space-x-10">
            {[
              {
                title: 'Webhook & API for External Apps',
                desc: 'Provide APIs for businesses to integrate document verification into their own systems.'
              },
              {
                title: 'Cloud Storage Integration',
                desc: 'Store verified documents securely in cloud storage (Google Drive, OneDrive, etc.).'
              }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-xl w-auto px-5 py-5 border shadow-2xl overflow-hidden">
                <i className="mx-5 my-10 fa-solid fa-code fa-xl" style={{ color: '#f7f6f9', backgroundColor: '#6d4abe', padding: '20px', borderRadius: '5px' }}></i>
                <h1 className="flex text-xl font-bold pt-5">{feature.title}</h1>
                <p className="text-lg text-gray-700 pt-2">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex pt-20 space-x-10">
            {[
              {
                title: 'Conversational AI for Verification',
                desc: 'A chatbot that guides user through the process and answers queries.'
              },
              {
                title: 'Instant Notification & Status Tracking',
                desc: 'Notify the users about verification progress in real-time feedback.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-xl w-auto px-5 py-5 border shadow-2xl overflow-hidden">
                <i className="mx-5 my-10 fa-solid fa-code fa-xl" style={{ color: '#f7f6f9', backgroundColor: '#6d4abe', padding: '20px', borderRadius: '5px' }}></i>
                <h1 className="flex text-xl font-bold pt-5">{feature.title}</h1>
                <p className="text-lg text-gray-700 pt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Dociffy Section */}
        <div className="bg-white rounded-2xl mx-2 my-2 px-20 py-20">
          <div className="flex bg-white text-sm space-x-1 px-5 py-2 w-fit font-bold rounded-xl border shadow-lg">
            <i className="fa-solid fa-gear pt-2" style={{ color: '#2a3447' }}></i>
            <p className="text-gray-700 text-lg">Why Dociffy</p>
          </div>

          <p className="text-2xl mt-5 font-semibold">Increase Protection and Security</p>
          <p className="text-lg mt-5 text-gray-700">Supercharge productivity. Stremline work by doing it, and seeing it, in one place.</p>

          <div className="flex pt-20 space-x-10">
            {[
              {
                title: 'AI-Powered',
                desc: 'Recognizes security features like holograms, watermarks, and microtext for government-issued documents.',
                bg: '#6d4abe'
              },
              {
                title: 'Instant & Hassle-Free Verification',
                desc: 'Real-time document scanning and verification within seconds.',
                bg: '#0fccd6'
              },
              {
                title: 'Mobile & Cloud-Enabled for Convenience',
                desc: 'Cloud storage integration with Google Drive, OneDrive, etc.',
                bg: '#0ee496'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl w-1/3 px-5 py-5 border overflow-hidden shadow-2xl">
                <i className="mx-5 my-10 fa-solid fa-code fa-xl" style={{ color: '#f7f6f9', backgroundColor: item.bg, padding: '20px', borderRadius: '5px' }}></i>
                <h1 className="flex text-xl font-bold pt-5">{item.title}</h1>
                <p className="text-xl text-gray-700 pt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <div id="aboutSection" className="bg-black rounded-xl text-white p-10">
          <h1 className="rounded-xl py-1 px-2 w-28 bg-white bg-opacity-15">About Us</h1>
          <h3 className="text-2xl my-5">Meet Our Team:</h3>
          <ul>
            <li><span className="text-xl">[Founder/CEO Name]</span> – Visionary behind Dociffy, ensuring secure and scalable verification.</li>
            <li><span className="text-xl">[Founder/CEO Name]</span> – Leads the tech team in building AI-powered document analysis.</li>
            <li><span className="text-xl">[Founder/CEO Name]</span> – Always ready to assist with your verification needs.</li>
          </ul>

          <h3 className="text-2xl my-5">📧 Contact Us:</h3>
          <ul>
            <li className="text-blue-400"><span className="text-white text-xl">General Inquiries:</span> – support@dociffy.com</li>
            <li className="text-blue-400"><span className="text-xl text-white">Partnerships & Business:</span> – support@dociffy.com</li>
            <li className="text-blue-400"><span className="text-xl text-white">Technical Support:</span> – support@dociffy.com</li>
          </ul>

          <h3 className="text-2xl my-5">❓ Need Help?</h3>
          <p>Check out our Help Center: <span className="text-blue-400">dociffy.com/help</span> or chat with our support team 24/7!</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
