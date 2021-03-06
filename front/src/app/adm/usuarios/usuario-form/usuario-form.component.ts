import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { PerfilPipe } from 'src/app/shared/pipes/perfil.pipe';
import { UsuariosService } from '../../adm-service-folder/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  formUsuarios: FormGroup;
  idUsuario: number = 0;
  isEdicao: boolean = false;
  exibir: boolean = false;
  texto: string = "Cadastrar";
  textoBotao: string = 'Salvar';
  perfis = [
    { codigo: 1, descricao: 'ADMIN' },
    { codigo: 2, descricao: 'CLIENTE'}
  ];


  dropdownSettings =  {
    singleSelection: false,
    idField: 'codigo',
    textField: 'descricao',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    defaultOpen: true
  };



  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, private usuariosService: UsuariosService) {
    this.formUsuarios = this.formBuilder.group({
      //valor inicial e os validadores
      id: ['', []],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      perfis: ['',[ ]]
    });
  }

  ngOnInit(): void {

    this.activatedRoute
      .params.subscribe(
        (parametros) => {
          console.log(parametros);
          if (parametros.id) {
            this.isEdicao = true;
            this.idUsuario = parametros.id;
            this.consultarUsuarioId(this.idUsuario);
            this.textoBotao = 'Editar';
            this.texto = "Alterar";
          }
        }

      )
  }

  onSubmit() {
    this.formUsuarios.value.perfis = this.getPerfis();
    if (this.isEdicao) {
       this.alterarUsuario(this.idUsuario, this.formUsuarios.value);
    }
    else {
      this.cadastrarUsuario(this.formUsuarios.value);
    }
  }

  private getPerfis(){
    let r =[];
    if(this.formUsuarios.value.perfis.length>0){
      this.formUsuarios.value.perfis.forEach(element => {
        r.push(element.codigo);
      });
    }
    return r;
  }

  private getRoules(){
    let r =[[]];
    if(this.formUsuarios.value.perfis.length>0){
      this.formUsuarios.value.perfis.forEach(element => {
        // r.push(element.codigo,element.codigo|pe);
      });
    }
    return r;
  }


  public consultarUsuarioId(idUsuario) {

    this.usuariosService.consultarUsuarioId(idUsuario).subscribe(
      (response:any) => {
        let perfilForm = [];
        let descPerfil;
        console.log(response);
          response.perfis.forEach(element => {
            console.log(element);
            if(element == 1){
              descPerfil = "ADMIN";
            }else if(element == 2){
              descPerfil = "CLIENTE";
            }
           perfilForm.push({codigo:element,descricao:descPerfil});
          });
        this.formUsuarios.patchValue({id:response.id,nome:response.nome,email:response.email,perfis:perfilForm});
      }
    );
  }

  public cadastrarUsuario(body) {
    this.usuariosService.cadastrarUsuario(body).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['adm/usuarios']);
      }
    );
  }

  private alterarUsuario(id,body){
    this.usuariosService.alterarUsuario(id, body)
    .subscribe(
      (dados) =>{
        console.log(dados);
        //this.toastr.success('Usuario Alterado com Sucesso!');
        this.router.navigate(['adm/usuarios']);
        // console.log(JSON.stringify(dados));
      }
    )
  }

  /**documentação */
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


  // MÉTODO DO MOSTRAR ERRO
  public isErrorField(fieldName) {
    return (this.formUsuarios.get(fieldName).valid == false && this.formUsuarios.get(fieldName).touched == true);
  }
}
