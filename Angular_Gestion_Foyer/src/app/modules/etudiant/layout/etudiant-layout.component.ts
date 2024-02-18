import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EtudiantService } from 'src/app/core/services/etudiant/etudiant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etudiant-layout',
  templateUrl: './etudiant-layout.component.html',
  styleUrls: ['./etudiant-layout.component.css']
})
export class EtudiantLayoutComponent {

  PassForm: FormGroup;

  constructor(private etudiantService: EtudiantService, private formBuilder: FormBuilder) {
    this.loadScript('assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js');
    this.loadScript('assets/vendor/tiny-slider/tiny-slider.js');
    this.loadScript('assets/vendor/glightbox/js/glightbox.js');
    this.loadScript('assets/vendor/purecounterjs/dist/purecounter_vanilla.js');
    this.loadScript('assets/vendor/apexcharts/js/apexcharts.min.js');
    this.loadScript('assets/vendor/overlay-scrollbar/js/overlayscrollbars.min.js');
    this.loadScript('assets/vendor/choices/js/choices.min.js');
    this.loadScript('assets/vendor/quill/js/quill.min.js');
    this.loadScript('assets/vendor/stepper/js/bs-stepper.min.js');
    this.loadScript('assets/js/functions.js');

    this.PassForm = this.formBuilder.group({
      password: ['', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    ]]
    });
  }


  loadScript(src: string) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  userconnect = JSON.parse(localStorage.getItem("userconnect")!);

  logout(){
    localStorage.clear()
  }

  updatePassword() {
    this.etudiantService.updatePassword(this.userconnect.id, this.PassForm.value.password).subscribe(res => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'Mot de passe modifié avec succès'
      });

      localStorage.setItem('userconnect', JSON.stringify(res));
      setTimeout(() => {
        window.location.href = "http://localhost:4200/etudiant/etudiant-profile";
      }, 1000);
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la modification du mot de passe'
      });
    });
  }

}
