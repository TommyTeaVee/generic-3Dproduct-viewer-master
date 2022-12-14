import type { ElementRef, OnInit } from '@angular/core';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { WebGLRenderer } from 'three';

@Component({
  selector: 'app-viewer-threejs',
  templateUrl: './viewer-threejs.component.html',
  styleUrls: ['./viewer-threejs.component.scss'],
})
export class ViewerThreejsComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  @Output()
  public sceneInit: EventEmitter<WebGLRenderer> = new EventEmitter<WebGLRenderer>();

  constructor() {
  }

  ngOnInit(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    this.sceneInit.emit(renderer);
  }
}
