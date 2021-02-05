import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery-9';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.scss']
})
export class MemeberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.user = data['user'];
      }
    );


    this.galleryOptions = [
      {
          width: '500px',
          height: '500px ',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          imagePercent: 100,
          preview: false
      }
  ];

  this.galleryImages = this.getImages();
  }


  getImages(){
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        large: photo.url,
        description: photo.description
      });
    }

    return imageUrls;
  }
  // loadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
  //     (userData: User) => {
  //       this.user = userData;
  //     },
  //     error => {
  //       this.alertify.error(error);
  //     }
  //   );
  // }

}
