import { NgFor, NgIf } from '@angular/common';
import { Component, WritableSignal, computed, effect, signal} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div style="text-align: center;">
    <h1>{{ title }} app is using standlone!</h1>
    <div>
        <p>
            value of signal {{count()}} | double is {{double()}}
        </p>
        <button (click)="increment()">Increment count</button>
    </div>

    <br>

    <div class="fullName">
        My name is {{fullName()}}
    </div>

    <br>

    <input #lastName (change)="updateLastName(lastName.value)" placeholder="Last name">

    <br><br>

    <input #firstName (change)="updateFirstName(firstName.value)" placeholder="First name">

    <div class="todos">
        <h2>My Todo List</h2>
        <ul>
            <li *ngFor="let todo of todos()">
                <span [class.line-through]="todo.done">{{ todo.title }}</span>
                <span class="done">{{ todo.done ? 'Done' : 'Not done'}}</span>
                <button *ngIf="!todo.done" class="edit" (click)="markTodoAsDone(todo)">Done</button>
                <button *ngIf="todo.done" class="edit" (click)="reset(todo)">Reset</button>
            </li>
        </ul>
    </div>
</div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Angular Signal for reactivity';

  // -------------------------- Exemple 1 avec set -----------------------------------------

  count: WritableSignal<number> = signal(0); // initial value

  constructor() {
    // You can perform side effects when a signal changes using the effect(callBackFn, options?) function
    effect(() => {
      console.log("--> Side effet fullName -> " + this.fullName());

      console.log("--> Side effet todos -> " + this.todos());
    });

    this.count.set(1); // remplace la valeur initiale par 1
  }

  // double is updated everytime the value of the count signal changes
  double = computed(() => this.count() * 2);

  increment = () => this.count.update(v => v + 1); // update the value of the signal


  // -------------------------- Exemple 2 avec compute -----------------------------------------

  firstName = "Babacar"; // not a signal

  lastName : WritableSignal<string> = signal("Faye"); // Initial value

  // if the lastName changes, fullName is changing as well
  // since firtsName is not a signal, a change will not udpate fullName
  fullName = computed(() => `${this.firstName} ${this.lastName()}`);

  // fullName will be updated
  updateLastName = (lastName: string) => this.lastName.set(lastName);

  // Will not update fullName
  updateFirstName = (firstName: string) => this.firstName = firstName;

  // -------------------------- Exemple 3 avec mutate -----------------------------------------

  todosArray: Todo[] = [
    {
      id: 1,
      title: 'Apprendre Angular Signals',
      done: false
    },
    {
      id: 2,
      title: 'Checking out Angular SSR',
      done: false
    }
  ];


  todos : WritableSignal<Todo[]> = signal<Todo[]>(this.todosArray);

  // Tout changement sur todos déclenche en effet secondaire

  toggleTodo = (todo: Todo, done: boolean) => this.todos.mutate(array => {
    const index = array.findIndex(t => t.id === todo?.id);
    if (index >= 0) {
      array[index].done = done;
    }
  });

  markTodoAsDone = (todo: Todo) => this.toggleTodo(todo, true);

  reset = (todo: Todo) => this.toggleTodo(todo, false);


 // Ouvrez la console du navigateur pour voir les information qui sont affichées

}

interface Todo {
  id: number
  title: string;
  done: boolean
}
