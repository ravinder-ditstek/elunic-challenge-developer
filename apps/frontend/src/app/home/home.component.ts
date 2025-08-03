import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface ApiResponse {
  message: string;
  items: number[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MessageModule, ListboxModule, CardModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string = '';
  items: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<ApiResponse>('/api').subscribe({
      next: (data) => {
        this.message = data.message;
        this.items = data.items;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
} 
