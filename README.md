# Task Manager (Angular)

A task manager built step by step to relearn Angular from the basics to a professional level. Each session adds one topic to the same app, so the commit history shows how a real Angular application grows: components, signals, services, RxJS, HTTP, routing, forms, state management, security, performance and testing.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Zoneless](https://img.shields.io/badge/change%20detection-zoneless-555)

## Features so far

- Add, complete, reopen and delete tasks, saved through a REST API
- Filter by status (all, open, done) and debounced server-side search
- Live stats: totals, percent done, high-priority count and a progress bar
- Loading state, readable error messages, automatic retry and a Retry button
- Optimistic updates with rollback when the server call fails
- Logging and error interceptors, a dev-server proxy and environment files

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Angular 22, standalone components, zoneless change detection |
| Language | TypeScript |
| State | Signals (`signal`, `computed`, `effect`) in a root service |
| Async | RxJS operators and `toSignal` |
| HTTP | `HttpClient` with functional interceptors |
| Mock backend | json-server (v1) serving `db.json` |
| Tooling | Angular CLI 22.2.6, Node.js 24.19.0, npm |

## Getting started

Prerequisites: Node.js and the Angular CLI (`npm install -g @angular/cli`).

```bash
git clone https://github.com/rahuljadhavrj3006-commits/task-manager.git
cd task-manager
npm install
```

The app needs two terminals.

```bash
# Terminal 1: the mock REST API on http://localhost:3000
npx json-server db.json --port 3000

# Terminal 2: the Angular app on http://localhost:4200
ng serve
```

Open `http://localhost:4200`. The app calls `/api/tasks`, and the dev server proxy (`proxy.conf.json`) forwards those calls to json-server, so there are no CORS problems in development.

## Architecture

```text
TaskList (component)      shows tasks, filter and search
   │
TaskStore (service)       state in signals, loading, errors, optimistic updates
   │
TaskApi (service)         the only class that knows about HTTP
   │
Interceptors              logging (timing, header) → error (retry, messages)
   │
Dev server proxy          /api/** → http://localhost:3000
   │
json-server               reads and writes db.json
```

Components stay thin. `TaskStore` owns the data and the rules, and `TaskApi` makes the HTTP calls. Swapping json-server for a real backend means changing `TaskApi` and the environment URL only.

## Project structure

```text
task-manager/
├── db.json                      mock database for json-server
├── proxy.conf.json              dev proxy: /api → port 3000
├── angular.json
├── package.json
└── src/
    ├── environments/
    │   ├── environment.ts               production settings
    │   └── environment.development.ts   development settings (apiUrl: /api)
    └── app/
        ├── app.ts, app.html             root component
        ├── app.config.ts                providers: router, HttpClient, interceptors
        ├── app.routes.ts                routes (Session 9)
        ├── task.ts                      Task interface
        ├── api-url.ts                   API_URL injection token
        ├── task-api.ts                  HTTP calls
        ├── task-store.ts                state and business rules
        ├── logging-interceptor.ts
        ├── error-interceptor.ts
        ├── highlight.ts                 custom attribute directive
        ├── priority-label-pipe.ts       custom pipe
        ├── header/                      app header with open count
        ├── task-list/                   list, filter, search (smart component)
        ├── task-card/                   one task (presentational)
        ├── task-form/                   add-task form
        └── task-stats/                  totals, progress bar, clock
```

## Learning log

| Session | Topic | Status |
| --- | --- | --- |
| 1 | Big picture, setup and folder structure | Done |
| 2 | Components and templates | Done |
| 3 | Control flow, lists, directives and pipes | Done |
| 4 | Component communication and lifecycle | Done |
| 5 | Signals and change detection | Done |
| 6 | Services and dependency injection | Done |
| 7 | Async programming and RxJS | Done |
| 8 | HTTP and API calls | Done |
| 9 | Routing | Planned |
| 10 | Forms | Planned |
| 11 | State management | Planned |
| 12 | Authentication and security | Planned |
| 13 | Performance and advanced topics | Planned |
| 14 | Testing and tooling | Planned |
| 15 | Project completion | Planned |
| 16 | Revision and mock interview | Planned |

### Session 1: Big picture, setup and folder structure

**Built:** a new zoneless Angular project created with `ng new task-manager` (CSS, no SSR).

**Learned:**
- The four building blocks: components, services, the router and dependency injection
- Single-page vs multi-page apps: one `index.html`, with the router swapping views
- Startup flow: `index.html` → `main.ts` (`bootstrapApplication`) → `app.config.ts` → root `App` component → router outlet
- What changed since Angular 18: standalone by default, no `AppModule`, shorter file names, zoneless

### Session 2: Components and templates

**Built:** `Header` and a first `TaskCard` with a title, status, toggle and rename.

**Learned:**
- Component anatomy: `selector`, `templateUrl`, `styleUrl`, `imports`, `changeDetection`, `encapsulation`
- Interpolation, property, attribute, class, style, event and two-way binding
- Template reference variables (`#box`) and why a component must be in `imports` to be used

**Key files:** `header/`, `task-card/`, `app.ts`, `app.html`

### Session 3: Control flow, lists, directives and pipes

**Built:** a task list with All / Open / Done filters, a hover-highlight directive and a priority-label pipe.

**Learned:**
- `@if`, `@for` with `track`, `@empty`, `@switch` and `@let`
- Structural vs attribute directives, and a custom directive using `host` bindings with `input()`
- Built-in and custom pipes, pipe precedence, pure vs impure pipes
- `computed` signals for derived lists

**Key files:** `task.ts`, `task-list/`, `highlight.ts`, `priority-label-pipe.ts`

### Session 4: Component communication and lifecycle

**Built:** the list split into a parent `TaskList`, reusable `TaskCard` children and a `TaskForm`.

**Learned:**
- `input()`, `input.required()`, `output()` and `model()`; data down, events up
- `viewChild`, content projection with `<ng-content>`, and `contentChild`
- The lifecycle hook order, watched live in the console, and the four hook phases
- Why `track` keeps a card alive and only `ngOnChanges` runs on an update

**Key files:** `task-card/`, `task-form/`, `task-list/`

### Session 5: Signals and change detection

**Built:** a `TaskStats` panel from a chain of `computed` values, tasks saved with an `effect`, and OnPush on every component.

**Learned:**
- `signal`, `computed` and `effect`, automatic dependencies, and why arrays must be replaced, not mutated
- Change detection with zone.js (Default and OnPush) vs zoneless
- The zoneless experiment: a plain property changed by a timer does not update the screen; a signal does

**Key files:** `task-stats/`, `task-list/`

### Session 6: Services and dependency injection

**Built:** a root `TaskStore` service holding the tasks, shared by `TaskList` and `Header`.

**Learned:**
- `@Injectable({ providedIn: 'root' })`, `inject()` and constructor injection
- Root, route and component providers; `useClass`, `useValue`, `useFactory`, `useExisting`
- `InjectionToken` for non-class values, and how Angular resolves a dependency up the injector tree
- Private writable signal with a public `asReadonly()` view; smart vs presentational components
- The provider experiment: `providers: [TaskStore]` on a component creates a private second instance

**Key files:** `task-store.ts`, `header/`, `task-list/`

### Session 7: Async programming and RxJS

**Built:** a debounced search box against a simulated slow server, and the clock moved to RxJS.

**Learned:**
- Promise vs Observable, cold vs hot, and the four Subject types
- Operators by category, and `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`
- `debounceTime`, `distinctUntilChanged`, `catchError` placement on the inner request
- Unsubscribing safely with `toSignal`, the `async` pipe and `takeUntilDestroyed`
- The experiment: with `mergeMap`, five requests answered out of order; with `switchMap`, older ones were cancelled

**Key files:** `task-list/`, `task-stats/`, `task-store.ts`

### Session 8: HTTP and API calls

**Built:** tasks moved from `localStorage` to a REST API (json-server), with interceptors, retries, loading and error states, a dev proxy and environment files.

**Learned:**
- `HttpClient` methods, typed responses, `HttpParams`, and why HTTP observables are cold
- Functional interceptors, cloning requests, and interceptor order (requests in order, responses in reverse)
- Error statuses (0, 4xx, 5xx), retrying only reads, and turning errors into readable messages
- Optimistic vs pessimistic updates with rollback
- CORS and the dev server proxy; environment files exposed through an `InjectionToken`
- The experiment: with the server stopped, the proxy returned 502, two retries ran and one log line showed the total time

**Key files:** `task-api.ts`, `task-store.ts`, `api-url.ts`, `logging-interceptor.ts`, `error-interceptor.ts`, `app.config.ts`, `proxy.conf.json`, `db.json`, `environments/`

## Updating this README after each session

1. In the **Learning log** table, change the session's status from Planned to Done.
2. Add a `### Session N: Topic` section with **Built**, **Learned** and **Key files**, in the same format as the sessions above.
3. Update **Features so far**, **Project structure** and **Architecture** if the session changed them.
4. Commit it with the session's code:

```bash
git add .
git commit -m "Session N: topic"
git push
```

## Author

Rahul Jadhav · [GitHub](https://github.com/rahuljadhavrj3006-commits)
