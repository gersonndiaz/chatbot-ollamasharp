import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ollamamodels',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './ollamamodels.component.html',
  styleUrl: './ollamamodels.component.css'
})
export class OllamamodelsComponent implements OnInit {
  httpClient = inject(HttpClient);
  public jsonResult: Result | null = null;

  ngOnInit(): void {
    this.httpClient.get('http://localhost:5092/api/ollama/models')
            .subscribe({
              next: (data: any) => 
              {
                console.log(data);
                this.jsonResult = data;
              },
              error: (error) => console.error(error)
            });
  }
}

export interface Details {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface Model {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Details;
}

export interface Result {
  result: Model[];
}
