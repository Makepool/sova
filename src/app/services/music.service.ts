import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Album, Artist } from '../models/albums.interface';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  artists: Artist[] = [];

  constructor(
    private readonly http: HttpClient,
  ) { }

  getArtists(): Observable<Artist[]> {
    if (this.artists.length) {
      return of(this.artists);
    }
    return this.http.get<Artist[]>('http://localhost:3000/artists')
      .pipe(
        map((response: Artist[]) => {
          this.artists = response;
          return response;
        })
      );
  }

  getAlbums(): Observable<[Album[], Artist[]]> {
    return forkJoin([
      this.http.get<Album[]>('http://localhost:3000/albums'),
      this.getArtists()
    ]).pipe(
      map((data: [Album[], Artist[]]) => {
        const [albums, artists] = data;
        albums.forEach(album => {
          album = this.setArtist(album, artists);
        });
        return [albums, artists];
      })
    );
  }

  addAlbum(album: Album): Observable<Album> {
    return forkJoin([
      this.http.post('http://localhost:3000/albums', album),
      this.getArtists()
    ]).pipe(
      map((data: [Album, Artist[]]) => {
        let [album, artists] = data;
        album = this.setArtist(album, artists);
        return album;
      })
    );
  }

  setArtist(album: Album, artists: Artist[]): Album {
    if (album.artist === undefined) {
      const artist = artists.find((artist => artist.id === album.artistId));
      album.artist = artist.name;
    }
    return album;
  }
}
