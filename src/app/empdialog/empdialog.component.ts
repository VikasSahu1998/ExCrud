import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empdialog',
  templateUrl: './empdialog.component.html',
  styleUrls: ['./empdialog.component.css']
})
export class EmpdialogComponent implements OnInit {

  empform : FormGroup |any;
  button1: string = "Save"
  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<EmpdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.empform = new FormGroup({
      name: new FormControl('', [Validators.required,]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    if (this.editData) {
      this.button1 = "Update";
      this.empform.controls['email'].setValue(this.editData.email);
      this.empform.controls['name'].setValue(this.editData.name);
    }
  }

  adddetail() {
    if (!this.editData) {
      if (this.empform.valid) {
        this.api.postEmp(this.empform.value)
          .subscribe({
            next: (res) => {
              this.toastr.success('details added successfully', 'successfully', { timeOut: 2000, });
              this.empform.reset();
              this.dialogref.close('save');
            },
            error: () => {
              alert("Something went wrong ")
              this.toastr.error('error while adding  the data', 'error', { timeOut: 2000, });
            }
          })
      }
    } else {
      this.updatedetail();
    }
  }

  updatedetail() {
    this.api.putEmp(this.empform.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.toastr.success('details updated successfully', 'successfully', { timeOut: 2000, });
          this.empform.reset();
          this.dialogref.close('update');
        },
        error: () => {
          this.toastr.error('error while updating the data', 'error', { timeOut: 2000, });
        }
      })
  }
}