import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import{ EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms'
import { EditorToolBarComponent } from './editor-tool-bar/editor-tool-bar.component';
import { EditorSideBarComponent } from './editor-side-bar/editor-side-bar.component';
import { EditorStatusBarComponent } from './editor-status-bar/editor-status-bar.component';
import { EditorConsoleComponent } from './editor-console/editor-console.component';
import { EditorBodyComponent } from './editor-body/editor-body.component';

@NgModule({
  declarations: [
    EditorComponent,
    EditorToolBarComponent,
    EditorSideBarComponent,
    EditorStatusBarComponent,
    EditorConsoleComponent,
    EditorBodyComponent
  ],
  imports: [
    EditorModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path:'',component:EditorComponent}])
  ]
})
export class ScriptEditorModule { 

}
