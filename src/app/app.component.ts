import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Album, Artist } from './models/albums.interface';
import { MusicService } from './services/music.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  albums: Album[] = [];
  artists: Artist[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['title', 'artist', 'year'];

  constructor(readonly musicService: MusicService) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      artist: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required])
    }, [this.checkUniqueToArtist]);

    this.musicService.getAlbums()
      .subscribe(
        (response: [Album[], Artist[]]) => {
          this.albums = response[0];
          this.artists = response[1];
        },
        (err: string) => console.log('error loading albums, pop something like this in a toast message for the user')
      );
  }

  checkUniqueToArtist = () => {
    if (this.form === undefined) {
      return;
    }

    const title = this.form.controls.title.value;
    const artistId = this.form.controls.artist.value;

    const result = this.albums.some((album) => {
      if (album.title === title && album.artistId === artistId) {
        return true;
      }
    });

    if (result) {
      return {
        notUnique: true
      };
    }
  }

  onSubmit() {
    const newAlbum: Album = {
      title: this.form.controls.title.value,
      year: this.form.controls.year.value,
      artistId: this.form.controls.artist.value
    };

    this.musicService.addAlbum(newAlbum)
      .subscribe(
        (response: Album) => this.albums = this.albums.concat(response),
        (err: string) => console.log(err)
      );
  }
}
