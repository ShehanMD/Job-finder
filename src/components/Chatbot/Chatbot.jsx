import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Bot, ArrowLeft, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './chatbot.css';

export default function Chatbot({ loggedInUser = null }) {
  const location = useLocation(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('INIT'); 
  const [historyStack, setHistoryStack] = useState([]); 
  
  const [chatData, setChatData] = useState({
    name: '',
    language: 'si'
  });

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
    setMessages([]);
    setStep('INIT');
    setHistoryStack([]);
    setChatData({ name: '', language: 'si' });
    setInputText('');
  }, [location.pathname]); 

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    const currentPath = location.pathname.toLowerCase();
    const isDashboard = currentPath.includes('seeker') || currentPath.includes('employer');

    if (loggedInUser || isDashboard) {
      const userName = loggedInUser?.displayName || 'මිත්‍රයා';
      setChatData({ ...chatData, name: userName });
      setStep('ASK_LANG');
      addMessage('bot', `👋 ආයුබෝවන් ${userName}! / Hello!\nකරුණාකර ඔබගේ භාෂාව තෝරන්න / Please select your language.`, [
        { id: 'si', label: 'සිංහල' },
        { id: 'en', label: 'English' }
      ]);
    } else {
      setStep('ASK_NAME');
      addMessage('bot', '👋 ආයුබෝවන්! මම HotJobs AI Assistant. \nකරුණාකර පහළින් ඔබගේ නම ටයිප් කර එවන්න. / Please enter your name below.');
    }
  };

  const addMessage = (sender, text, options = []) => {
    setMessages(prev => [...prev, { sender, text, options }]);
  };

  const handleBack = () => {
    if (historyStack.length > 0) {
      const previousState = historyStack.pop();
      setMessages(previousState.messages);
      setStep(previousState.step);
      setHistoryStack([...historyStack]);
    }
  };

  const handleOptionClick = (option) => {
    setHistoryStack(prev => [...prev, { messages: [...messages], step }]);
    addMessage('user', option.label);

    setTimeout(() => {
      if (step === 'ASK_LANG') {
        setChatData(prev => ({ ...prev, language: option.id }));
        showMainMenu(option.id);
      } 
      else if (step === 'MAIN_MENU') {
        showAnswer(option.id, chatData.language);
      }
      else if (step === 'FAQ_FOLLOWUP') {
        if (option.id === 'BACK_TO_MENU') {
          showMainMenu(chatData.language);
        } else if (option.id === 'CLOSE_CHAT') {
          setIsOpen(false); 
        }
      }
    }, 500);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setHistoryStack(prev => [...prev, { messages: [...messages], step }]);
    addMessage('user', inputText);
    setChatData(prev => ({ ...prev, name: inputText }));
    setInputText('');

    setTimeout(() => {
      setStep('ASK_LANG');
      addMessage('bot', `ස්තූතියි ${inputText}! කරුණාකර ඔබගේ භාෂාව තෝරන්න / Please select your language.`, [
        { id: 'si', label: 'සිංහල' },
        { id: 'en', label: 'English' }
      ]);
    }, 500);
  };

  const showMainMenu = (lang) => {
    setStep('MAIN_MENU');
    const currentPath = location.pathname.toLowerCase();
    
    let msg = lang === 'si' ? `ඔබට දැනගැනීමට අවශ්‍ය කුමක්ද?` : `What do you want to know?`;
    let options = [];

    // Employer Dashboard
    if (currentPath.includes('employer')) {
      options = lang === 'si' ? [
        { id: 'POST_JOB', label: 'රැකියාවක් Post කරන්නේ කෙසේද?' },
        { id: 'VIEW_POSTED_JOBS', label: 'පළ කළ රැකියා බැලීම' }
      ] : [
        { id: 'POST_JOB', label: 'How to post a job?' },
        { id: 'VIEW_POSTED_JOBS', label: 'How to view posted jobs?' }
      ];
    } 
    // Seeker Dashboard
    else if (currentPath.includes('seeker')) {
      options = lang === 'si' ? [
        { id: 'APPLY_JOB', label: 'ජොබ් එකකට Apply කරන්නේ කෙසේද?' },
        { id: 'COMPLETED_JOBS', label: 'අවසන් කළ වැඩ බැලීම' }
      ] : [
        { id: 'APPLY_JOB', label: 'How to apply for a job?' },
        { id: 'COMPLETED_JOBS', label: 'How to view completed jobs?' }
      ];
    } 
    // Home / Login Pages
    else {
      if (lang === 'si') {
        options = [
          { id: 'SIGNUP_EMPLOYER', label: 'Employer ලෙස ලියාපදිංචි වීම' },
          { id: 'SIGNUP_SEEKER', label: 'Seeker ලෙස ලියාපදිංචි වීම' },
          { id: 'LOGIN_HELP', label: 'ගිණුමට ලොග් (Login) වීම' },
          { id: 'ABOUT', label: 'HotJobs යනු කුමක්ද?' }
        ];
      } else {
        options = [
          { id: 'SIGNUP_EMPLOYER', label: 'Register as an Employer' },
          { id: 'SIGNUP_SEEKER', label: 'Register as a Seeker' },
          { id: 'LOGIN_HELP', label: 'How to Login' },
          { id: 'ABOUT', label: 'What is HotJobs?' }
        ];
      }
    }
    
    addMessage('bot', msg, options);
  };

  const showAnswer = (questionId, lang) => {
    setStep('FAQ_FOLLOWUP'); 
    
    const answers = {
      // 1. Pre-login / Sign up Answers
      SIGNUP_EMPLOYER: {
        si: "Employer කෙනෙක් ලෙස ලියාපදිංචි වීමට:\n\n1. 'Employer Sign up' තෝරා, Individual (පුද්ගලික) හෝ Company (ආයතනයක්) ලෙස තෝරන්න.\n2. Company නම්: ඊමේල් හා මුරපදය දී Register වන්න. ඉන්පසු Company name, username, established date, address, reg no, phone no, සහ සහතිකය අප්ලෝඩ් කර 'Finish' දෙන්න.\n3. Individual නම්: Full name, username, birthday, සහ address ලබා දී 'Finish' දෙන්න.\n4. දැන් ඔබගේ ලියාපදිංචිය සම්පූර්ණයි. කරුණාකර Login වන්න.",
        en: "To register as an Employer:\n\n1. Select 'Employer Sign up' and choose Individual or Company.\n2. If Company: Enter email & password, click Register. Then fill in company name, username, established date, address, reg no, phone no, upload your certificate and click 'Finish'.\n3. If Individual: Fill in full name, username, birthday, and address, then click 'Finish'.\n4. Your registration is complete. Please login."
      },
      SIGNUP_SEEKER: {
        si: "රැකියා සොයන්නෙකු ලෙස ලියාපදිංචි වීමට:\n\n1. 'Seeker Sign up' තෝරා ඊමේල් හා මුරපදය ලබා දී Register බොත්තම ඔබන්න.\n2. ඉන්පසු Full name, username, birthday, address, phone no, සහ NIC ඡායාරූපය ඇතුළත් කර 'Finish' කරන්න.",
        en: "To register as a Job Seeker:\n\n1. Select 'Seeker Sign up', enter your email and password, and click Register.\n2. Then provide your full name, username, birthday, address, phone no, upload your NIC photo and click 'Finish'."
      },
      LOGIN_HELP: {
        si: "ගිණුමට ඇතුළු වීමට (Login):\n\n'Sign in' බොත්තම ක්ලික් කරන්න. ඉන්පසු ඔබගේ ඊමේල් ලිපිනය සහ මුරපදය (password) ලබා දී ලොග් වන්න.",
        en: "To login to your account:\n\nClick on 'Sign in'. Then enter your registered email and password to log in."
      },
      ABOUT: {
        si: "HotJobs යනු රැකියා සොයන්නන් සහ සේවා යෝජකයන් එකිනෙකාට සම්බන්ද කරන ශ්‍රී ලංකාවේ ප්‍රමුඛතම වේදිකාවයි.",
        en: "HotJobs is Sri Lanka's leading platform connecting job seekers with employers."
      },

      // 2. Seeker Dashboard Answers
      APPLY_JOB: {
        si: "රැකියාවකට Apply කිරීමට:\n\n1. ඔබගේ Dashboard එකෙහි ජොබ් කාඩ් දිස්වනු ඇත (අවශ්‍ය නම් Explore Job හරහා සෙවිය හැක).\n2. 'View Job' ක්ලික් කර විස්තර බලන්න.\n3. 'Apply' බොත්තම ඔබන්න.\n4. Admin ඉල්ලීම Accept කරන තෙක් රැඳී සිටින්න.\n5. Accept වූ පසු වැඩ ඇති ස්ථානයට ගොස් Location share කරන්න (එවිට වැඩ කරන කාලය ඇරඹේ).\n6. වැඩ අවසන් වූ පසු 'Quit' බොත්තම ඔබන්න.\n7. ඔබට පැය 24ක් ඇතුළත මුදල ගෙවනු ලැබේ.",
        en: "To apply for a job:\n\n1. Job cards are on your dashboard (or search via 'Explore Job').\n2. Click 'View Job' to see details.\n3. Click 'Apply'.\n4. Wait until the Admin accepts your request.\n5. Once accepted, go to the workplace and share your location (work time starts).\n6. Click 'Quit' when the work/time is finished.\n7. You will be paid within 24 hours."
      },
      COMPLETED_JOBS: {
        si: "ඔබ අවසන් කළ වැඩ බැලීමට:\n\nඔබගේ ප්‍රොෆයිල් (Profile) අයිකනය ක්ලික් කිරීමෙන් අවසන් කළ වැඩ බලාගත හැක.",
        en: "To view your completed jobs:\n\nClick on your Profile icon to see the jobs you have successfully completed."
      },

      // 3. Employer Dashboard Answers
      POST_JOB: {
        si: "අලුත් රැකියාවක් Post කිරීමට:\n\n1. 'Post New Job' ක්ලික් කරන්න.\n2. අදාළ විස්තර සියල්ල පුරවන්න.\n3. 'Post Job' ක්ලික් කරන්න. දැන් ඔබගේ රැකියාව පළවී ඇත.",
        en: "To post a new job:\n\n1. Click 'Post New Job'.\n2. Fill in all the relevant details.\n3. Click 'Post Job'. Your job is now posted successfully."
      },
      VIEW_POSTED_JOBS: {
        si: "ඔබ Post කළ ජොබ්ස් බැලීමට:\n\n'View Post Job' බොත්තම ක්ලික් කරන්න. එහිදී ඔබ පළ කළ සියලුම රැකියා පෙනෙනු ඇත.",
        en: "To view your posted jobs:\n\nClick on 'View Post Job'. You will be able to see all the job listings you have created."
      }
    };
    
    const reply = answers[questionId]?.[lang] || (lang === 'si' ? "තොරතුරු සොයාගත නොහැක." : "Information not found.");
    addMessage('bot', reply, []);

    setTimeout(() => {
      const followUpMsg = lang === 'si' ? "ඔබට තවත් ගැටලු තිබේද?" : "Do you have any other questions?";
      addMessage('bot', followUpMsg, [
        { id: 'BACK_TO_MENU', label: lang === 'si' ? 'ඔව්, ප්‍රධාන මෙනුවට යන්න' : 'Yes, Main Menu' },
        { id: 'CLOSE_CHAT', label: lang === 'si' ? 'නැත, ස්තූතියි' : 'No, Thanks' }
      ]);
    }, 1000);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chat-window">
          
          <div className="chat-header">
            <div className="chat-header-info">
              {historyStack.length > 0 && (
                <button className="back-chat-btn" onClick={handleBack} title="Go Back">
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="header-avatar">
                <Bot size={24} />
              </div>
              <div className="chat-title-container">
                <h3 className="chat-title">HotJobs</h3>
                <span className="chat-subtitle">AI Assistant</span>
              </div>
            </div>
            <button className="close-chat-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`message-row ${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <div className="msg-avatar">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  {/* style={{ whiteSpace: 'pre-wrap' }} නිසා පේළි අංක (1, 2, 3...) ලස්සනට පල්ලෙහාට පෙළගැසේවි */}
                  <div className="message-bubble">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                </div>
                
                {msg.options && msg.sender === 'bot' && index === messages.length - 1 && (
                  <div className="options-container">
                    {msg.options.map((opt) => (
                      <button key={opt.id} className="option-btn" onClick={() => handleOptionClick(opt)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleNameSubmit}>
            <input 
              type="text" 
              className="chat-input"
              placeholder={step === 'ASK_NAME' ? "Type your name..." : "Select an option above..."} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={step !== 'ASK_NAME'}
              autoFocus={step === 'ASK_NAME'}
            />
            <button type="submit" className="chat-send-btn" disabled={!inputText.trim() || step !== 'ASK_NAME'}>
              <Send size={20} />
            </button>
          </form>

        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}