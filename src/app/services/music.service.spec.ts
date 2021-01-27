import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MusicService } from './music.service';
import { HttpClient } from '@angular/common/http';
import { Album, Artist } from '../models/albums.interface';

describe('MusicService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    }).compileComponents();

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    const service: MusicService = TestBed.get(MusicService);
    expect(service).toBeTruthy();
  });

  it('should return an array of artists when getArtists() is called', () => {
    const service: MusicService = TestBed.get(MusicService);

    const dummy: Artist[] = [
      { id: 1, name: 'Marvin Gaye' },
      { id: 2, name: 'The Beatles' },
      { id: 3, name: 'Michael Jackson' },
      { id: 4, name: 'Lady Gaga' }
    ];

    service.getArtists().subscribe((artists: Artist[]) => {
      expect(artists.length).toBe(4);
    });

    const request = httpMock.expectOne('http://localhost:3000/artists');

    expect(request.request.method).toBe('GET');

    request.flush(dummy);
  });

  it('should not make a call to the server when called a second time', () => {
    const service: MusicService = TestBed.get(MusicService);
    service.artists = [{ id: 1, name: 'Marvin Gaye' }];

    service.getArtists().subscribe((artists: Artist[]) => {
      expect(artists.length).toBe(1);
    });

    const request = httpMock.expectNone('http://localhost:3000/artists');
  });
});
