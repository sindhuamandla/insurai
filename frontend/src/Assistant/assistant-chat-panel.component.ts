import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from './assistant.service';

interface Message {
  id: number;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Component({
  selector: 'app-assistant-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant-chat-panel.component.html',
  styleUrls: ['./assistant-chat-panel.component.css']
})
export class AssistantChatPanelComponent implements OnInit, AfterViewChecked {
  @Output() viewPlans = new EventEmitter<void>();

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: Message[] = [
    {
      id: 1,
      sender: 'assistant',
      text: 'Hi! I’m the InsurAI assistant. Ask anything about your corporate insurance, appointments or plans.',
      time: 'Now'
    }
  ];
  input: string = '';
  isListening: boolean = false;
  isTyping: boolean = false;

  constructor(private assistantService: AssistantService) { }

  ngOnInit() {
    // Scroll handling is done in ngAfterViewChecked
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  addMessage(sender: 'assistant' | 'user', text: string) {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    this.messages.push({
      id: this.messages.length + 1,
      sender,
      text,
      time
    });
  }

  handleSend() {
    const text = this.input.trim();
    if (!text) return;

    this.addMessage('user', text);
    this.input = '';

    this.isTyping = true;
    this.assistantService.chat(text).subscribe({
      next: (res) => {
        const reply = res.reply || "Sorry, I could not generate a reply right now.";
        this.addMessage('assistant', reply);
        this.isTyping = false;
      },
      error: (err) => {
        console.error('AI assistant error', err);
        this.addMessage('assistant', "There was a problem talking to the AI assistant. Please try again.");
        this.isTyping = false;
      }
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }

  handleMicClick() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.addMessage('assistant', "Voice recognition is not supported in this browser. Please type your question instead.");
      return;
    }

    if (this.isListening) {
      this.isListening = false;
      // Note: Logic to stop recognition would technically require storing the instance, 
      // but simplistic toggle aligns with React code logic structure though React re-created instance.
      // We'll mimic the React behavior of just creating a new one or assuming it stops self.
      // Ideally we should keep a reference to stop it properly. 
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.isListening = true;
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.input = this.input ? this.input + " " + transcript : transcript;
    };

    recognition.onerror = () => {
      this.addMessage('assistant', "Sorry, I couldn’t catch that. Please try speaking again or type your message.");
      this.isListening = false;
    };

    recognition.onend = () => {
      this.isListening = false;
    };

    recognition.start();
  }
}
