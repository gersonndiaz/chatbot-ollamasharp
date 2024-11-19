import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private hubConnection: signalR.HubConnection | undefined;
  public messages: { id: string, content: string, type: 'user' | 'gpt' }[] = [];
  public userMessage: string = '';
  public isSending: boolean = false;
  private messageBuffer: { [key: string]: string } = {};

  ngOnInit(): void {
    this.startConnection();
    this.addReceiveMessageListener();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5092/hubs/chat') // Cambia la URL según sea necesario
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Conexión iniciada con el hub de SignalR.'))
      .catch(err => console.error('Error al iniciar la conexión con el hub: ', err));
  }

  private addReceiveMessageListener(): void {
    this.hubConnection?.on('ReceiveMessage', (message: string, messageId: string) => {
      // Acumular fragmentos de mensajes en el buffer
      if (!this.messageBuffer[messageId]) {
        this.messageBuffer[messageId] = '';
      }
      this.messageBuffer[messageId] += message;

      // Verificar si es la primera parte del mensaje
      let existingMessage = this.messages.find(msg => msg.id === messageId);
      if (existingMessage) {
        existingMessage.content = this.messageBuffer[messageId];
      } else {
        this.messages.push({ id: messageId, content: this.messageBuffer[messageId], type: 'gpt' });
      }

      // Desbloquear el textarea si la respuesta ha terminado (última parte del mensaje)
      this.isSending = false;
    });
  }

  public sendMessage(): void {
    if (this.hubConnection && this.userMessage.trim()) {
      // Añadir el mensaje del usuario y bloquear el textarea
      this.messages.push({ id: 'user-' + Date.now(), content: this.userMessage, type: 'user' });
      this.isSending = true;

      this.hubConnection.invoke('GetMessage', this.userMessage)
        .then(() => this.userMessage = '')
        .catch(err => console.error('Error al enviar el mensaje: ', err));
    }
  }

  public convertMarkdownToHTML(markdown: string): string {
    // Aquí se implementa la lógica para convertir Markdown a HTML
    // Esta función puede ser extendida según las necesidades
    return markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/_(.*?)_/g, '<em>$1</em>')
                   .replace(/`(.*?)`/g, '<code>$1</code>')
                   .replace(/^\*\s(.*?)(\r?\n|$)/gm, '<li>$1</li>') 
                   .replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')
                   .replace(/\n/g, '<br>');
  }
}