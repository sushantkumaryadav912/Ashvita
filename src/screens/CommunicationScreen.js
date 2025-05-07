import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Vibration
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#f8f9fa',
  textPrimary: '#2d3436',
  primary: '#e74c3c', // Emergency red
  primaryDark: '#c0392b',
  secondary: '#3498db', // Medical blue
  tertiary: '#2ecc71', // Success green
  light: '#ffffff',
  muted: '#e9ecef',
  userBubble: '#e3f2fd',
  aiBubble: '#f0f4f8',
  inputBg: '#fff',
  inputBorder: '#ced4da',
  warning: '#f39c12',
  danger: '#e74c3c',
  gray: '#7f8c8d',
  lightGray: '#dfe6e9'
};

const SAMPLE_MESSAGES = [
  {
    id: '1',
    text: "Hello! I'm Ashvita's emergency healthcare assistant. How can I help you today?",
    isUser: false,
    timestamp: new Date().getTime() - 1000 * 60 * 5, // 5 minutes ago
    isUrgent: false
  }
];

const EmergencyButton = ({ onPress }) => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity 
      style={styles.emergencyButtonContainer} 
      onPress={() => {
        Vibration.vibrate(200);
        onPress();
      }}
      activeOpacity={0.7}
    >
      <Animated.View 
        style={[
          styles.emergencyButton,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <FontAwesome5 name="ambulance" size={24} color={COLORS.light} />
        <Text style={styles.emergencyButtonText}>SOS</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const QuickActionButton = ({ icon, label, onPress, color = COLORS.secondary }) => (
  <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: color }]} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={24} color={COLORS.light} />
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function CommunicationScreen() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUrgentPrompt, setShowUrgentPrompt] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);


  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Check for urgent keywords
    const urgentKeywords = ['emergency', 'urgent', 'pain', 'severe', 'ambulance', 'heart attack', 'stroke', 'bleeding', 'accident'];
    const isUrgent = urgentKeywords.some(keyword => inputText.toLowerCase().includes(keyword));
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
      isUrgent
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Show urgent banner if detected
    if (isUrgent && !showUrgentPrompt) {
      setShowUrgentPrompt(true);
      Vibration.vibrate([0, 300, 100, 300]);
    }
    
    // Check for AI feature inquiries
    const isAIQuery = inputText.toLowerCase().includes('ai') || 
                      inputText.toLowerCase().includes('features') || 
                      inputText.toLowerCase().includes('update');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      let responseText;
      
      if (isAIQuery) {
        responseText = "We're excited to announce that Ashvita will soon be powered by advanced generative AI! Coming updates include:\n\n" +
                      "• Faster emergency response recommendations\n" +
                      "• Personalized health monitoring\n" +
                      "• More accurate symptom analysis\n" +
                      "• Real-time medical guidance\n\n" +
                      "These features are currently in development and will be available in our next update.";
      } else {
        const aiResponses = [
          "I understand your concern. Based on the symptoms you've described, it would be advisable to consult with a healthcare provider. Would you like me to locate the nearest emergency facility?",
          "That's a common question. The recommended dosage depends on several factors including your age and weight. Let me provide you with general guidelines, but please confirm with your doctor.",
          "I've analyzed your symptoms and they could indicate several conditions. It's important to seek medical attention to get a proper diagnosis. Would you like information on specialists near you?",
          "Based on your health profile, your vital signs are within normal range, but I notice your blood pressure has increased slightly from your last reading. Would you like me to schedule a follow-up with your doctor?"
        ];
        responseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }
      
      const aiMessage = {
        id: Date.now().toString(),
        text: responseText,
        isUser: false,
        timestamp: Date.now(),
        isUrgent: false
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleEmergencyCall = () => {
    // In a real app, this would trigger an emergency call
    alert('Emergency services would be contacted now. This is a demonstration.');
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.isUser ? styles.userMessage : styles.aiMessage,
      item.isUrgent && styles.urgentMessage
    ]}>
      {item.isUrgent && (
        <View style={styles.urgentBadge}>
          <MaterialIcons name="priority-high" size={14} color={COLORS.light} />
          <Text style={styles.urgentBadgeText}>Urgent</Text>
        </View>
      )}
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  const sendQuickMessage = (text) => {
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
      isUrgent: text.includes('emergency')
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      let response;
      
      if (text.includes('emergency')) {
        response = "I understand this is an emergency. I'll help you contact emergency services immediately. Can you confirm your current location?";
        setShowUrgentPrompt(true);
        Vibration.vibrate([0, 300, 100, 300]);
      } else if (text.includes('nearest hospital')) {
        response = "Based on your current location, the nearest hospitals are:\n1. City General Hospital (2.3 miles)\n2. Memorial Medical Center (3.5 miles)\n3. University Health Center (4.1 miles)\n\nWould you like directions to any of these facilities?";
      } else if (text.includes('AI features')) {
        response = "We're excited to announce that Ashvita will soon be powered by advanced generative AI! Coming updates include:\n\n" +
          "• Real-time symptom analysis with higher accuracy\n" +
          "• Personalized emergency guidance based on your medical history\n" +
          "• Natural language processing for faster communication\n" +
          "• Integration with medical knowledge databases\n\n" +
          "Stay tuned for these exciting updates in our next release!";
      } else if (text.includes('chat')) {
        response = "Hello! I'm here to help with your healthcare needs. Our chat functionality allows you to describe your symptoms, ask medical questions, or request emergency assistance. How can I assist you today?";
      } else {
        response = "I understand you need medical advice. Could you please tell me more about your symptoms so I can better assist you?";
      }
      
      const aiMessage = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
        timestamp: Date.now(),
        isUrgent: text.includes('emergency')
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <View style={styles.customHeader}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Ashvita</Text>
            <Text style={styles.subtitle}>Emergency Healthcare Assistant</Text>
          </View>
          <EmergencyButton onPress={handleEmergencyCall} />
        </View>
        
        {/* Quick action buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionContainer}>
          <QuickActionButton 
            icon="message-alert" 
            label="Emergency" 
            onPress={() => sendQuickMessage("I have an emergency situation")} 
            color={COLORS.danger}
          />
          <QuickActionButton 
            icon="hospital-building" 
            label="Hospitals" 
            onPress={() => sendQuickMessage("Show me the nearest hospital")}
          />
          <QuickActionButton 
            icon="message-text" 
            label="Chat" 
            onPress={() => sendQuickMessage("I'd like to chat with the healthcare assistant")}
            color={COLORS.secondary}
          />
          <QuickActionButton 
            icon="robot" 
            label="AI Help" 
            onPress={() => sendQuickMessage("Tell me about the upcoming AI features")}
            color={COLORS.tertiary}
          />
        </ScrollView>
      </View>
      

      {showUrgentPrompt && (
        <View style={styles.urgentPromptBanner}>
          <MaterialIcons name="warning" size={24} color={COLORS.light} />
          <Text style={styles.urgentPromptText}>Emergency detected! Need immediate assistance?</Text>
          <TouchableOpacity 
            style={styles.urgentCallButton}
            onPress={handleEmergencyCall}
          >
            <Text style={styles.urgentCallButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {showUpdateBanner && (
        <View style={styles.updateBanner}>
          <MaterialIcons name="update" size={20} color={COLORS.secondary} />
          <Text style={styles.updateText}>
            Coming soon: Advanced AI features for faster emergency response and personalized health monitoring
          </Text>
          <TouchableOpacity onPress={() => setShowUpdateBanner(false)}>
            <MaterialIcons name="close" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.secondary} />
          <Text style={styles.typingText}>Ashvita AI is responding...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe your emergency or health concern..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={inputText.trim() ? COLORS.light : COLORS.lightGray} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimer}>
          For life-threatening emergencies, call 911 or your local emergency number immediately.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  updateBanner: {
    backgroundColor: COLORS.light,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  updateText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    flex: 1,
    marginHorizontal: 10,
    lineHeight: 18,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  customHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.light,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.light,
    opacity: 0.9,
  },
  emergencyButtonContainer: {
    marginLeft: 10,
  },
  emergencyButton: {
    backgroundColor: COLORS.danger,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emergencyButtonText: {
    color: COLORS.light,
    fontWeight: 'bold',
    marginTop: 2,
    fontSize: 12,
  },
  quickActionContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickActionButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 6,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionLabel: {
    color: COLORS.light,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  vitalStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vitalStat: {
    alignItems: 'center',
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    minWidth: 80,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  vitalLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.aiBubble,
    borderBottomLeftRadius: 4,
  },
  urgentMessage: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  urgentBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  urgentBadgeText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.secondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    backgroundColor: COLORS.light,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.muted,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  disclaimerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.danger,
    opacity: 0.9,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.light,
    textAlign: 'center',
    fontWeight: '500',
  },
  urgentPromptBanner: {
    backgroundColor: COLORS.danger,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  urgentPromptText: {
    color: COLORS.light,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 8,
  },
  urgentCallButton: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgentCallButtonText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 12,
  },
});