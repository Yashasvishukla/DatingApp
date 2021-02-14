import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService){}


  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken : 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: false,
      removeAfterUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain,
          url: res.url
        };
        this.photos.push(photo);
        if(photo.isMain){
          this.getMemberPhotoChange.emit(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

  setAsMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter(p => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.getMemberPhotoChange.emit(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        this.alertify.success('Successfully set the main photo');
      },
    error => {
      this.alertify.error(error);
    }
    );
  }

  deletePhoto(id: number){
    // if (confirm('Are you sure you want to delete the photo')){
    //   this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(
    //     () => {
    //       this.photos.slice(this.photos.findIndex(p => p.id === id), 1);
    //       this.alertify.success('Photo deleted Successfully');
    //     },
    //     error => {
    //       this.alertify.error(error);
    //     }
    //   );
    // }

    this.alertify.confirm('Are you sure you want to delete the photo', () =>
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(
        () => {
          this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
          this.alertify.success('Photo deleted Successfully');
        }
        , error => {
          this.alertify.error(error);
        }
      )
    );


  }
}
