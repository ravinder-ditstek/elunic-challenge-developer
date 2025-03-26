import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';

interface ApiResponse {
  message: string;
  items: number[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MessageModule, ListboxModule, CardModule],
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
