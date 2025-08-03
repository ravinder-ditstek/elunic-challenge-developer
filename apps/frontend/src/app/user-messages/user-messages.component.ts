import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface UserMessage {
  id: number;
  message: string;
  created_date: string;
}

interface PaginatedResponse {
  data: UserMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss']
})
export class UserMessagesComponent implements OnInit {
  messages: UserMessage[] = [];
  newMessage: string = '';
  loading: boolean = false;
  creating: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 3;
  totalRecords: number = 0;
  totalPages: number = 0;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.http.post<PaginatedResponse>('/api/user-messages/paginated', {
      page: this.currentPage,
      limit: this.pageSize
    }).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.messages = response.data;
        this.totalRecords = response.pagination.total;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        console.error('Error details:', error.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load messages'
        });
        // Set default values to prevent NaN
        this.totalRecords = 0;
        this.totalPages = 0;
        this.messages = [];
        this.loading = false;
      }
    });
  }

  createMessage(): void {
    if (!this.newMessage.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a message'
      });
      return;
    }

    this.creating = true;
    this.http.post<UserMessage>('/api/user-messages', {
      message: this.newMessage
    }).subscribe({
      next: (message) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message created successfully'
        });
        this.newMessage = '';
        this.loadMessages(); // Reload to show new message
        this.creating = false;
      },
      error: (error) => {
        console.error('Error creating message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create message'
        });
        this.creating = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    this.pageSize = event.rows;
    this.loadMessages();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  // Make Math available in template
  Math = Math;
} 