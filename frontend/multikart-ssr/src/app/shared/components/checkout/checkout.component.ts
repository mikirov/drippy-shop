import {AfterViewInit, Component, HostListener, Inject, OnInit} from '@angular/core';
import {CheckoutService} from '../../services/checkout.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../models/product';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements AfterViewInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<CheckoutComponent>) {
    }

    codInput: HTMLInputElement;
    customerInfoIdInput: HTMLInputElement;
    confirmForm: HTMLFormElement;
    url = 'http://delivery.demo.econt.com/customer_info.php';


    ngAfterViewInit(): void {
        this.customerInfoIdInput = document.getElementsByName('customerInfo')[0] as HTMLInputElement;
        this.confirmForm = document.getElementById('confirm-form') as HTMLFormElement;

    }

    @HostListener('window:message', ['$event'])
    OnMessage(message) {
        // console.log(message)
        const data = message.data;
        this.dialogRef.close(data);
    }
}
