import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Neuf","Reconditionné","D'occasion"]
  productForm !: FormGroup;
  actionBtn : string = "Sauvegarder"
  constructor(private formBuilder : FormBuilder ,
     private api : ApiService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({

      productName : ['', Validators.required],
      category : ['', Validators.required],
      freshness : ['',Validators.required],
      price:['',Validators.required],
      comment: ['',Validators.required],
      date: ['' , Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Mettre à jour";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
    
    
  }
  addProduct(){
   
   if(!this.editData){
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next:(res) =>{
          alert("Produit ajouté !")
          this.productForm.reset();
          this.dialogRef.close('sauvegarder');
        },
        error:()=>{
          alert("Erreur pendant l'ajout du produit")
        }
      })
    }
   }else{
     this.updateProduct()
   }
  
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Produit mis à jour !");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Erreur lors de la mise à jour !!");
      }
    })
  }
}
