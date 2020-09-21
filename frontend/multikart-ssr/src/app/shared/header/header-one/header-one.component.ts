import {Component, OnInit, Input, HostListener} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-header-one',
    templateUrl: './header-one.component.html',
    styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {

    @Input() class: string;
    @Input() themeLogo = 'assets/images/icon/logo.png'; // Default Logo
    @Input() topbar = true; // Default True
    @Input() sticky = false; // Default false

    public stick = false;

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {
    }

    // @HostListener Decorator
    @HostListener('window:scroll', [])
    onWindowScroll() {
        const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (number >= 300 && window.innerWidth > 400) {
            this.stick = true;
        } else {
            this.stick = false;
            // tslint:disable-next-line:indent
        }
    }

}
