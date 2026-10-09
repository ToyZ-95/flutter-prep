import fs from "fs";
import path from "path";

const guideContent = `# Flutter Developer Interview Guide — Beginner to Advanced

This handbook is designed to give you rigorous, comprehensive, and interview-ready answers to every core question asked in Flutter and Dart technical interviews.

Every concept in this guide is structured with:
- **Formal Technical Definition**: What the concept is according to Flutter & Dart engineering standards.
- **Under The Hood Mechanics**: How it actually works inside the Dart VM, Flutter Engine, Element Tree, or memory heap.
- **Production Code Examples**: Clear, runnable, and idiomatically typed snippets.
- **Common Interview Traps & Gotchas**: The tricky follow-ups and edge cases interviewers use to test depth.
- **30-Second Model Spoken Answer**: A concise, polished verbal answer you can speak directly in an interview.

---

# How to Answer Flutter Interview Questions

### 1. The Senior Candidate Framework
When asked a conceptual or architectural question:
1. **Define it in one crisp sentence** (show clarity of thought).
2. **Explain why it exists / the problem it solves** (show practical engineering mindset).
3. **Describe how it works under the hood** (show technical depth).
4. **Mention trade-offs, pitfalls, or interview edge cases** (show production experience).

### 2. Answering Code-Output Questions
When presented with tricky Dart code:
- **Do not guess immediately**.
- Check whether the code compiles (compile-time vs runtime).
- Check variable immutability: **reference immutability** vs **object immutability**.
- Trace the event loop or execution stack step by step.

---

# Level 1 — Beginner Flutter & Dart

## Q1. What is Flutter and how does its architecture work?

### Technical Definition
Flutter is Google's open-source UI software development kit for building natively compiled, multi-platform applications from a single codebase written in Dart. It targets Android, iOS, Web, Windows, macOS, and Linux.

Unlike hybrid frameworks (e.g. React Native or Ionic), Flutter **does not wrap native OEM platform widgets** and **does not use a web view**. Instead, Flutter draws every single pixel directly onto a canvas using its own high-performance graphics engine.

### Flutter Architecture Layers
Flutter is divided into three distinct architectural layers:

1. **Framework Layer (Dart)**:
   - High-level building blocks used by application developers.
   - Contains Material & Cupertino widget libraries, Widgets layer (composition), Rendering layer (RenderObjects, layout, painting), and Foundation services (gestures, animation).

2. **Engine Layer (C/C++)**:
   - The heart of Flutter. It manages rasterization, graphics rendering (via **Impeller** on modern iOS/Android and **Skia**), text layout (LibTxt / HarfBuzz), file and network I/O, accessibility, and the Dart VM runtime.

3. **Embedder Layer (Platform-Specific)**:
   - Written in Java/Kotlin (Android), Objective-C/Swift (iOS), and C++ (Desktop).
   - Coordinates with the host operating system for surface rendering, platform message routing (Platform Channels), input events, and OS lifecycle callbacks.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│  Framework (Dart)                                      │
│  Material / Cupertino → Widgets → Rendering → Painting │
├────────────────────────────────────────────────────────┤
│  Engine (C/C++)                                        │
│  Impeller/Skia → Dart VM Runtime → Text (HarfBuzz)     │
├────────────────────────────────────────────────────────┤
│  Embedder (Java, Kotlin, Swift, Obj-C, C++)            │
│  Surface → OS Plugins → Event Dispatcher → Lifecycle   │
└────────────────────────────────────────────────────────┘
\`\`\`

### Common Interview Trap
> **Interviewer**: *"Does Flutter use native iOS buttons on iPhone and native Android buttons on Pixel?"*
>
> **Answer**: **No.** Flutter draws simulated Cupertino and Material widgets from scratch onto a Skia/Impeller canvas. It mimics native platform gestures, physics, and typography, but it is not rendering native OEM views unless you explicitly use a \`PlatformView\`.

### 30-Second Model Spoken Answer
> "Flutter is a multi-platform UI toolkit that renders its own widget tree directly to an OS canvas via a C++ graphics engine—Impeller or Skia—eliminating OEM widget bridges. Its architecture comprises three layers: the Dart Framework for UI composition, the C++ Engine for rendering and Dart VM execution, and the native Embedder for OS integration."

---

## Q2. What is Dart and why did Flutter choose it?

### Technical Definition
Dart is a client-optimized, object-oriented language developed by Google. It features sound null safety, strong typing with type inference, mixin-based inheritance, and a single-threaded isolate concurrency model.

### Why Flutter Uses Dart
Flutter selected Dart over languages like JavaScript, TypeScript, Swift, or C++ because of several unique engine capabilities:

1. **Dual Compilation Model (JIT + AOT)**:
   - **Just-In-Time (JIT)** during development: Dart compiles code dynamically into bytecode, enabling sub-second **Stateful Hot Reload**.
   - **Ahead-Of-Time (AOT)** for production release: Dart compiles directly into native ARM/x86 machine code, yielding instant app startup and steady 60/120 FPS rendering with zero bridge overhead.
2. **Generational Garbage Collection**:
   - Flutter's declarative UI model instantiates and discards thousands of lightweight immutable widget objects every second.
   - Dart's GC features a young-generation nursery space optimized for rapid allocation and reclamation of short-lived objects without causing frame drops (jank).
3. **Single-Threaded Isolate Model**:
   - Dart runs execution inside **Isolates** with an event loop. Because memory is not shared between threads, there are no lock contentions, deadlocks, or multi-threaded race conditions on the UI thread.
4. **Declarative Layout Without Markup**:
   - Dart does not require XML or JSX. Flutter UI is constructed directly in clean Dart code, allowing standard refactoring, strong typing, and logic colocation.

---

## Q3. What is a Widget in Flutter?

### Technical Definition
A **Widget** in Flutter is an **immutable description of a part of the user interface**. Widgets are declarative configuration blueprints.

\`\`\`dart
class GreeterWidget extends StatelessWidget {
  final String username;
  const GreeterWidget({super.key, required this.username});

  @override
  Widget build(BuildContext context) {
    return Text(
      'Welcome, \$username!',
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );
  }
}
\`\`\`

### Critical Concept: Widgets Are Not What Gets Drawn
A frequent misconception is that Widgets calculate sizing or draw pixels on the screen:
- **Widgets** are cheap, immutable blueprints created and thrown away in microseconds.
- **Elements** represent the live structural node managing the lifecycle and holding state.
- **RenderObjects** handle geometry, layout constraints, sizing, painting, and hit testing.

---

## Q4. StatelessWidget vs StatefulWidget?

### Deep Technical Comparison

| Dimension | StatelessWidget | StatefulWidget |
|---|---|---|
| **Mutability** | Completely immutable configuration. | Widget is immutable; paired \`State\` object is mutable. |
| **Lifecycle** | Single lifecycle method: \`build(BuildContext)\`. | Full lifecycle: \`initState\`, \`didChangeDependencies\`, \`build\`, \`didUpdateWidget\`, \`dispose\`. |
| **State Storage** | Does not retain local mutable state between rebuilds. | Persists mutable state across parent widget rebuilds. |
| **Rebuild Trigger** | Only when parent rebuilds or inherited dependencies change. | When parent rebuilds OR when internal \`setState()\` is invoked. |
| **Associated Element** | \`StatelessElement\` | \`StatefulElement\` which holds a reference to \`State<T>\`. |

### Code Example

\`\`\`dart
// StatelessWidget: Data passed exclusively via constructor
class StaticUserCard extends StatelessWidget {
  final String name;
  const StaticUserCard({super.key, required this.name});

  @override
  Widget build(BuildContext context) => Text(name);
}

// StatefulWidget: Local mutable state managed over time
class LiveCounter extends StatefulWidget {
  final int initialValue;
  const LiveCounter({super.key, this.initialValue = 0});

  @override
  State<LiveCounter> createState() => _LiveCounterState();
}

class _LiveCounterState extends State<LiveCounter> {
  late int _count;

  @override
  void initState() {
    super.initState();
    _count = widget.initialValue;
  }

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _increment,
      child: Text('Count: \$_count'),
    );
  }
}
\`\`\`

---

## Q5. What is \`setState()\` and what happens under the hood?

### Technical Definition
\`setState()\` is a method on the \`State\` class that notifies the framework that the internal state of this object has changed, marking its associated \`Element\` as **dirty**.

\`\`\`dart
void _toggleFavorite() {
  setState(() {
    _isFavorited = !_isFavorited;
  });
}
\`\`\`

### Internal Mechanics Under The Hood
1. When \`setState(fn)\` is called, Flutter immediately runs the synchronous callback function \`fn\`.
2. The framework marks the widget's associated \`StatefulElement\` as dirty: \`_element.markNeedsBuild()\`.
3. The element is added to the \`BuildOwner\`'s list of dirty elements for the current frame.
4. On the next pipeline frame, \`BuildOwner\` walks the dirty elements and calls their \`build()\` methods.
5. Flutter diffs the new widget against the existing element tree and updates the underlying \`RenderObject\` only where necessary.

---

## Q6. What is \`BuildContext\` under the hood?

### Technical Definition
\`BuildContext\` is an abstract handle to the location of a widget in the widget tree.

### Under The Hood
**\`BuildContext\` is literally the \`Element\` itself!**
In the Flutter framework source code:
\`\`\`dart
abstract class Element extends DiagnosticableTree implements BuildContext {
  // Element implements the entire BuildContext interface!
}
\`\`\`

Because every \`Element\` is a node in the element tree, it knows:
- Its parent and ancestors.
- Its children.
- The inherited data (\`InheritedWidget\`s like \`Theme\`, \`MediaQuery\`, \`Provider\`) registered above it.

### How \`Theme.of(context)\` Actually Works
When you call \`Theme.of(context)\`, context searches upwards using:
\`\`\`dart
context.dependOnInheritedWidgetOfExactType<Theme>();
\`\`\`
This registers your current element as a dependent on the ancestor \`Theme\` element. When the theme changes, Flutter automatically marks your element as dirty and triggers a rebuild!

---

## Q7. \`const\` vs \`final\` — The Complete Deep Dive & Tricky Code Analysis

This is one of the most frequently asked, and frequently failed, interview questions in Flutter/Dart interviews.

### The Exact Interview Code Trap

\`\`\`dart
void main() {
  const list1 = [];
  list1.add(1);
  print(list1);

  final list = [];
  list.add(1);
  print(list);
}
\`\`\`

### Question: What happens when this code is executed?
1. Does it fail at compile time?
2. Does it fail at runtime?
3. What is printed?

### Answer:
- **Line 2 (\`const list1 = [];\` and \`list1.add(1);\`):**
  - **Compile-time**: It compiles without static errors because the declared type of \`list1\` is \`List<dynamic>\`, which exposes an \`.add()\` method.
  - **Runtime**: It **CRASHES** with a runtime exception:
    \`\`\`text
    UnsupportedError: Cannot add to an unmodifiable list
    \`\`\`
- **Line 6 (\`final list = [];\` and \`list.add(1);\`):**
  - It compiles cleanly and runs successfully.
  - It prints: \`[1]\`.

---

### Why Does This Happen? (Reference Immutability vs Object Immutability)

#### 1. \`final\` provides REFERENCE IMMUTABILITY
- \`final\` means the variable binding itself cannot be reassigned to a different memory address.
- The object sitting in the heap memory that \`list\` points to is a normal, mutable \`GrowableList\`.
- Mutating the internal state of the list via \`list.add(1)\` or \`list.remove(0)\` is completely valid because you are **mutating the object, not reassigning the variable reference**.
- However, reassigning the reference is illegal:
  \`\`\`dart
  final list = [];
  list = [2]; // ❌ COMPILE ERROR: The final variable 'list' can only be set once.
  \`\`\`

#### 2. \`const\` provides OBJECT IMMUTABILITY + COMPILE-TIME CANONICALIZATION
- \`const\` creates a compile-time constant.
- The object itself is deeply and permanently frozen in memory. Dart backs \`const []\` with an unmodifiable collection view.
- Every mutating method (\`add\`, \`addAll\`, \`remove\`, \`operator []=\`) is programmed to throw an \`UnsupportedError\` at runtime.
- Furthermore, \`const\` objects are **canonicalized**: identical compile-time constants reuse the exact same physical memory location:
  \`\`\`dart
  final a = const [1, 2];
  final b = const [1, 2];
  print(identical(a, b)); // Output: true (Same memory address!)

  final c = [1, 2];
  final d = [1, 2];
  print(identical(c, d)); // Output: false (Two separate heap allocations!)
  \`\`\`

---

### Comprehensive Comparison Matrix

| Feature | \`final\` | \`const\` |
|---|---|---|
| **Evaluation Timing** | Initialized at **runtime** when evaluated. | Evaluated at **compile-time**. |
| **Immutability Scope** | **Reference immutability only** (the object in memory remains mutable unless explicitly frozen). | **Deep object immutability** (the entire object graph and its members are frozen). |
| **Memory Allocation** | Allocates a new instance in heap memory every time code runs. | **Canonicalized**: Dart reuses a single shared instance in memory. |
| **Dependencies** | Can be initialized with runtime expressions (\`DateTime.now()\`, API responses). | Can only be initialized with compile-time literals and other \`const\` values. |
| **Class Fields** | Can be used as instance fields in any class. | Can only be used for instance fields if class has a \`const\` constructor, or as \`static const\`. |
| **Widget Rebuild Optimization** | Flutter reallocates and diffs the widget on parent rebuild. | Flutter skips rebuilding and diffing: \`identical(old, new) == true\`. |

---

## Q8. What is \`pubspec.yaml\`? — Every Concept You Need to Know

\`pubspec.yaml\` is the project manifest for any Dart and Flutter application. It defines metadata, dependencies, build settings, environment constraints, and asset declarations.

### 1. Anatomy of \`pubspec.yaml\`

\`\`\`yaml
name: my_ecommerce_app
description: A production Flutter shopping application.
publish_to: 'none' # Prevents accidental publishing to pub.dev!

version: 2.1.0+42 # SemVer + Internal Build Number

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: '>=3.16.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  provider: ^6.1.1
  shared_ui:
    path: ../packages/shared_ui

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.8

dependency_overrides:
  intl: 0.19.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/logo.png
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700
\`\`\`

---

### 2. The Caret Sign (\`^\`) and Semantic Versioning (SemVer)
Semantic versioning adheres to \`MAJOR.MINOR.PATCH\`:
- **MAJOR**: Breaking API changes.
- **MINOR**: Backward-compatible new features.
- **PATCH**: Backward-compatible bug fixes.

#### How the Caret (\`^\`) Works:
- For versions **1.0.0 and above**:
  \`^1.2.3\` is shorthand for:
  \`\`\`text
  >=1.2.3 <2.0.0
  \`\`\`
  It allows automatic upgrades to bug fixes (\`1.2.4\`) and new features (\`1.3.0\`), but strictly blocks breaking releases (\`2.0.0\`).

#### 🔥 THE CRITICAL INTERVIEW TRAP: What does \`^0.2.3\` mean?
> **Interviewer**: *"If my pubspec has \`package: ^0.2.3\`, will running \`flutter pub upgrade\` update it to \`0.3.0\`?"*
>
> **Answer**: **NO! It will NOT.**
> In SemVer, **any version below 1.0.0 is considered unstable**. A minor increment (from \`0.2.x\` to \`0.3.0\`) is legally allowed to contain **breaking changes**!
> Therefore:
> - \`^0.2.3\` translates to: \`>=0.2.3 <0.3.0\`
> - \`^0.0.3\` translates to: \`>=0.0.3 <0.0.4\`

---

### 3. Understanding \`version: 2.1.0+42\`
The version string is split by the \`+\` sign into two critical components:
1. **Semantic Version (\`2.1.0\`)**:
   - The user-facing marketing version.
   - On Android: maps to \`versionName\`.
   - On iOS: maps to \`CFBundleShortVersionString\`.
2. **Build Number (\`42\`)**:
   - The internal monotonically increasing integer used by app stores.
   - On Android: maps to \`versionCode\`. Google Play rejects updates unless this number is higher than the previous release.
   - On iOS: maps to \`CFBundleVersion\`. TestFlight and App Store require this for build identification.

---

### 4. Dependency Categories & Sources
- **\`dependencies\`**: Packages compiled into the production binary.
- **\`dev_dependencies\`**: Development tools only (\`build_runner\`, \`flutter_test\`). Never bundled into the production binary.
- **\`dependency_overrides\`**: Forces a specific version across the entire dependency graph to resolve transitive conflicts.
- **Package Sources**: Hosted (\`pub.dev\`), Git (\`git: url: ... ref: ...\`), Local path (\`path: ../core\`), SDK (\`sdk: flutter\`).
- **\`pubspec.lock\` Rule**: ALWAYS commit \`pubspec.lock\` for Flutter applications (for deterministic builds). NEVER commit \`pubspec.lock\` for reusable packages.

---

## Q9. What are Keys in Flutter and when are they needed?

### Technical Definition
A \`Key\` is an identifier for \`Widget\`s, \`Element\`s, and \`SemanticsNode\`s. Keys preserve state when widgets move around the widget tree.

### The Classic Interview State Bug (Why Keys Exist)
Imagine swapping two stateful tiles displaying colors:
\`\`\`dart
Row(
  children: [
    ColoredTile(), // Tile A (Red)
    ColoredTile(), // Tile B (Blue)
  ],
)
\`\`\`
If you swap the order without keys: the UI colors **DO NOT SWAP**!

### Why? (Element Tree Matching Algorithm)
When Flutter diffs the widget tree against the element tree, it checks:
\`\`\`dart
static bool canUpdate(Widget oldWidget, Widget newWidget) {
  return oldWidget.runtimeType == newWidget.runtimeType && oldWidget.key == newWidget.key;
}
\`\`\`
Because both have identical \`runtimeType\` and both have \`key == null\`, Flutter reuses the existing \`Element\` and its old \`State\`. Supplying keys (\`ValueKey('A')\` and \`ValueKey('B')\`) makes \`canUpdate\` return \`false\`, properly matching and swapping the states!

### Key Types in Flutter
1. **\`ValueKey<T>\`**: Compares based on a value (e.g. \`ValueKey(user.id)\`).
2. **\`ObjectKey\`**: Compares based on object reference identity (\`identical\`).
3. **\`UniqueKey\`**: Creates a guaranteed unique key each build to force complete recreation.
4. **\`PageStorageKey\`**: Preserves scroll positions across tab switches.
5. **\`GlobalKey\`**: Uniquely identifies an element across the entire app. Allows accessing state (\`formKey.currentState!.validate()\`) or reparenting without losing state. Expensive—use sparingly!

---

## Q10. What is Hot Reload vs Hot Restart vs Full Restart?

| Feature | Hot Reload | Hot Restart | Full Restart |
|---|---|---|---|
| **Mechanism** | Injects updated Dart source code into running Dart VM. | Clears app state and re-runs \`main()\`. | Rebuilds and reinstalls the application on the device. |
| **State Preservation** | **Preserves existing application state.** | **Resets all state to initial values.** | Resets everything; reinitializes native platform. |
| **Speed** | Sub-second (~200ms–500ms). | ~1–3 seconds. | ~10–30 seconds. |
| **When It Fails** | Modifying static variables, changing \`initState\`, altering generic types. | Adding new native plugins or asset files. | N/A |

---

# Level 2 — Core Flutter

## Q11. The Three Trees in Flutter: Widget, Element, and RenderObject

\`\`\`text
1. Widget Tree (Immutable Blueprints)
   Container → Padding → Text
        ↓             ↓         ↓
2. Element Tree (Mutable Lifecycle & State Nodes)
   ComponentElement → SingleChildRenderObjectElement → RenderObjectElement
        ↓             ↓         ↓
3. RenderObject Tree (Geometry, Layout, Painting)
   [None]       → RenderPadding → RenderParagraph
\`\`\`

- **Widget Tree**: Lightweight, immutable blueprints created and discarded every frame.
- **Element Tree**: The persistent structural skeleton. Manages lifecycle and holds state. \`Element\` implements \`BuildContext\`.
- **RenderObject Tree**: Heavyweight rendering engine node. Computes layout (sizing and positioning), paints to canvas, and handles hit-testing.
- **Rule**: Not all widgets have a \`RenderObject\`. \`StatelessWidget\` and \`StatefulWidget\` only compose other widgets. Only \`RenderObjectWidget\`s (\`Padding\`, \`SizedBox\`, \`RichText\`) instantiate \`RenderObject\`s.

---

## Q12. Flutter's Rendering Pipeline: How Frames Are Rendered

### The Golden Rule of Flutter Layout
> **Constraints go down.**
> **Sizes go up.**
> **Parent sets position.**

\`\`\`text
Parent passes BoxConstraints (minWidth, maxWidth, minHeight, maxHeight)
                      ↓
           Child computes its Size
                      ↑
Parent places child at an Offset (x, y)
\`\`\`

1. **Animate**: Ticker updates animation controllers and schedules a new frame.
2. **Build**: Flutter executes \`build()\` on dirty elements, producing an updated widget tree.
3. **Layout**: Constraints flow down; sizes flow up; parent sets offset.
4. **Paint**: RenderObjects draw to canvases. Subtrees wrapped in \`RepaintBoundary\` cache their pixels into a separate layer.
5. **Compositing**: Flattens visual layers into a scene graph.
6. **Rasterization**: C++ Engine (Impeller/Skia) converts vector commands into GPU pixels.

---

## Q13. StatefulWidget Full Lifecycle Explained

\`\`\`text
1. createState()
      ↓
2. initState()
      ↓
3. didChangeDependencies()
      ↓
4. build()  ←────────────────────────┐
      ↓                              │
[Active on Screen]                   │
      ↓                              │
  setState() ────────────────────────┘
      │
  didUpdateWidget() ─────────────────┘
      ↓
5. deactivate()
      ↓
6. dispose()
\`\`\`

- **\`initState()\`**: Runs once when State is mounted. Initialize streams, controllers. Do NOT call \`Theme.of(context)\` here!
- **\`didChangeDependencies()\`**: Called after \`initState\` and whenever an \`InheritedWidget\` you depend on updates.
- **\`build()\`**: Pure rendering function called repeatedly. Keep it fast with zero side effects.
- **\`didUpdateWidget()\`**: Called when parent rebuilds with new widget configuration matching the same \`runtimeType\` and \`key\`.
- **\`dispose()\`**: State permanently removed. Mandatory cleanup for stream subscriptions, animation controllers, focus nodes, and text controllers.

---

## Q14. App Lifecycle: How to Observe Application Background / Foreground

Flutter monitors operating system application states via \`AppLifecycleListener\` (modern Flutter 3.13+) or \`WidgetsBindingObserver\`.

\`\`\`dart
class LifecycleAwareScreen extends StatefulWidget {
  const LifecycleAwareScreen({super.key});

  @override
  State<LifecycleAwareScreen> createState() => _LifecycleAwareScreenState();
}

class _LifecycleAwareScreenState extends State<LifecycleAwareScreen> {
  late final AppLifecycleListener _listener;

  @override
  void initState() {
    super.initState();
    _listener = AppLifecycleListener(
      onResume: () => print('App resumed: Refresh data from server'),
      onPause: () => print('App paused: Save draft to local SQLite'),
      onDetach: () => print('App terminating: Clean up socket connections'),
    );
  }

  @override
  void dispose() {
    _listener.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Home')));
}
\`\`\`

---

# Level 3 — Dart & Asynchronous Programming

## Q15. Dart Event Loop: Microtask Queue vs Event Queue

Dart is a single-threaded execution environment. It handles asynchrony through an **Event Loop** managing two separate priority queues:

1. **Microtask Queue** (HIGHER PRIORITY): Internal core operations, \`scheduleMicrotask()\`, \`Future.microtask()\`.
2. **Event Queue** (NORMAL PRIORITY): I/O events, gestures, timer callbacks (\`Future.delayed\`), standard \`Future\` completions.

> **The Event Loop exhausts ALL items in the Microtask Queue before processing a single item from the Event Queue.**

---

### 🔥 The Classic Interview Execution Prediction Puzzle

\`\`\`dart
import 'dart:async';

void main() {
  print('1');

  scheduleMicrotask(() => print('2'));

  Future(() => print('3'));

  Future.microtask(() => print('4'));

  Future.value().then((_) => print('5'));

  print('6');
}
\`\`\`

### Question: What is the exact output sequence of this code?
### Answer: \`1, 6, 2, 4, 5, 3\`

### Step-by-Step Trace:
1. Synchronous code executes immediately: prints **\`1\`**.
2. \`scheduleMicrotask(() => print('2'))\` schedules callback in **Microtask Queue**.
3. \`Future(() => print('3'))\` schedules callback in **Event Queue**.
4. \`Future.microtask(() => print('4'))\` schedules callback in **Microtask Queue**.
5. \`Future.value().then((_) => print('5'))\`: \`Future.value()\` completes immediately, its \`.then()\` callback is scheduled as a **microtask**!
6. Synchronous code finishes: prints **\`6\`**.
7. Main thread sync block is complete. Event Loop processes the **Microtask Queue** first:
   - Processes microtask 1: prints **\`2\`**.
   - Processes microtask 2: prints **\`4\`**.
   - Processes microtask 3: prints **\`5\`**.
8. Microtask Queue is completely drained. Event Loop turns to the **Event Queue**:
   - Processes event 1: prints **\`3\`**.

---

## Q16. Concurrency: \`async/await\` vs \`Isolate\`

- **\`async/await\`** is cooperative multitasking on the **SAME UI thread**. It does not spawn background threads. Performing heavy CPU computation in an async function will freeze the UI and drop frames!
- **\`Isolate\`** creates a true background worker thread with its own independent memory heap. Communication happens strictly through message passing (\`SendPort\` and \`ReceivePort\`).

\`\`\`dart
import 'dart:convert';
import 'dart:isolate';

// Heavy synchronous computation
List<User> parseHeavyJson(String jsonString) {
  final List<dynamic> decoded = jsonDecode(jsonString);
  return decoded.map((e) => User.fromJson(e)).toList();
}

Future<void> loadUsers() async {
  final String rawResponse = await api.getRawLargeString();
  // Spawns worker isolate, runs function, passes result back, and shuts down isolate
  final users = await Isolate.run(() => parseHeavyJson(rawResponse));
  print('Parsed \${users.length} users with ZERO UI jank!');
}
\`\`\`

---

# Level 4 — Platform Channels & Native Communication

## Q17. Platform Channels Architecture

Flutter uses a flexible messaging architecture to communicate with native platform host code (Android Kotlin/Java, iOS Swift/Objective-C, macOS, Windows).

\`\`\`text
[ Dart UI Isolate ]
        ↕
  BinaryMessenger (Serializes method call & args via StandardMessageCodec)
        ↕
[ C++ Flutter Engine ]  (Passes binary buffer across thread boundary)
        ↕
[ Platform Main Thread ] (Android / iOS Host)
        ↕
[ Native Code (Kotlin / Swift) ]
\`\`\`

---

## Q18. MethodChannel vs EventChannel vs BasicMessageChannel

### Comprehensive Comparison Matrix

| Feature | MethodChannel | EventChannel | BasicMessageChannel |
|---|---|---|---|
| **Communication Pattern** | **RPC (Request-Response)** | **Event Stream (Publisher-Subscriber)** | **Continuous or Single Message Passing** |
| **Dart Return Type** | \`Future<T>\` | \`Stream<T>\` | \`Future<T>\` or callback |
| **Direction** | Bidirectional (Dart ⇄ Native) | **One-way stream (Native Host → Dart)** | Bidirectional |
| **Native Protocol** | \`setMethodCallHandler\` | \`StreamHandler\` (\`onListen\`, \`onCancel\`) | \`setMessageHandler\` |
| **Use Cases** | Get battery level, open camera, biometric check, device ID. | Gyroscope sensor readings, live GPS stream, network connectivity changes. | Raw byte transfer, custom video frames, custom codecs. |

---

### MethodChannel Implementation Example (Battery Level)

#### 1. Dart Side:
\`\`\`dart
import 'package:flutter/services.dart';

class BatteryService {
  static const _channel = MethodChannel('com.example.app/battery');

  static Future<int> getBatteryLevel() async {
    try {
      final int level = await _channel.invokeMethod('getBatteryLevel');
      return level;
    } on PlatformException catch (e) {
      print('Failed to get battery: \${e.message}');
      return -1;
    }
  }
}
\`\`\`

#### 2. Android (Kotlin):
\`\`\`kotlin
class MainActivity : FlutterActivity() {
  private val CHANNEL = "com.example.app/battery"

  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)

    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
      if (call.method == "getBatteryLevel") {
        val batteryLevel = getDeviceBatteryLevel()
        if (batteryLevel != -1) {
          result.success(batteryLevel)
        } else {
          result.error("UNAVAILABLE", "Battery level not available.", null)
        }
      } else {
        result.notImplemented()
      }
    }
  }

  private fun getDeviceBatteryLevel(): Int {
    val bm = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
    return bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
  }
}
\`\`\`

#### 3. iOS (Swift):
\`\`\`swift
@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override fun application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(name: "com.example.app/battery",
                                              binaryMessenger: controller.binaryMessenger)

    batteryChannel.setMethodCallHandler({
      (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
      guard call.method == "getBatteryLevel" else {
        result(FlutterMethodNotImplemented)
        return
      }
      let device = UIDevice.current
      device.isBatteryMonitoringEnabled = true
      if device.batteryState == UIDevice.BatteryState.unknown {
        result(FlutterError(code: "UNAVAILABLE", message: "Battery info unavailable", details: nil))
      } else {
        result(Int(device.batteryLevel * 100))
      }
    })

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
\`\`\`

---

### EventChannel Implementation Example (Live Accelerometer / Sensor Stream)

#### 1. Dart Side:
\`\`\`dart
import 'package:flutter/services.dart';

class SensorStreamService {
  static const _eventChannel = EventChannel('com.example.app/sensors');

  static Stream<double> get accelerometerStream {
    return _eventChannel.receiveBroadcastStream().map((event) => event as double);
  }
}
\`\`\`

#### 2. Android (Kotlin):
\`\`\`kotlin
class MainActivity : FlutterActivity() {
  private val SENSOR_CHANNEL = "com.example.app/sensors"
  private var sensorManager: SensorManager? = null
  private var sensorListener: SensorEventListener? = null

  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)

    EventChannel(flutterEngine.dartExecutor.binaryMessenger, SENSOR_CHANNEL)
      .setStreamHandler(object : EventChannel.StreamHandler {
        // Called when Dart starts listening (receiveBroadcastStream)
        override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
          sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
          val sensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

          sensorListener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent?) {
              event?.let { events?.success(it.values[0].toDouble()) }
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
          }
          sensorManager?.registerListener(sensorListener, sensor, SensorManager.SENSOR_DELAY_NORMAL)
        }

        // CRITICAL: Called when Dart cancels stream subscription
        override fun onCancel(arguments: Any?) {
          sensorManager?.unregisterListener(sensorListener)
          sensorListener = null
        }
      })
  }
}
\`\`\`

> **CRITICAL INTERVIEW POINT**: If native host listeners are not unregistered inside \`onCancel\`, the hardware sensor or native listener will **continue running forever in the background**, creating a severe **memory leak** and rapidly draining device battery!

---

# Level 5 — State Management & BLoC

## Q19. BLoC (Business Logic Component) Architecture Deep Dive

\`\`\`text
UI (Widgets)
    │ (Dispatches Event)
    ↓
┌───────────┐
│   BLoC    │ ── Process Business Logic / Call Repositories
└───────────┘
    │ (Emits State)
    ↓
UI (Rebuilds via BlocBuilder / BlocConsumer)
\`\`\`

- **Cubit vs BLoC**: Cubit uses direct methods (\`cubit.increment()\`), making it concise for simple CRUD. BLoC uses formal events (\`bloc.add(IncrementEvent())\`), providing complete event traceability and support for **Event Transformers** (\`debounceTime\`, \`droppable\`, \`restartable\`).

\`\`\`dart
// BLoC with Debounce Event Transformer
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final SearchRepository repository;

  SearchBloc(this.repository) : super(SearchInitial()) {
    on<QueryChanged>(
      _onQueryChanged,
      transformer: (events, mapper) => events
          .debounceTime(const Duration(milliseconds: 300))
          .switchMap(mapper),
    );
  }

  Future<void> _onQueryChanged(QueryChanged event, Emitter<SearchState> emit) async {
    if (event.query.isEmpty) {
      emit(SearchInitial());
      return;
    }
    emit(SearchLoading());
    try {
      final results = await repository.search(event.query);
      emit(SearchSuccess(results));
    } catch (_) {
      // emit error state
    }
  }
}
\`\`\`

---

## Q20. \`BlocBuilder\` vs \`BlocListener\` vs \`BlocConsumer\` vs \`BlocSelector\`

| Widget | Purpose | Rebuilds UI? | Performs Side Effects? |
|---|---|---|---|
| **\`BlocBuilder\`** | Pure UI rendering based on state. | **YES** | ❌ (Never show dialogs or navigate here!) |
| **\`BlocListener\`** | Reacting to state changes with one-time actions (navigating, SnackBars). | ❌ | **YES** |
| **\`BlocConsumer\`** | Combines builder and listener in one widget. | **YES** | **YES** |
| **\`BlocSelector\`** | Rebuilds ONLY when a specific selected sub-field of state changes. | **YES (Targeted)** | ❌ |

---

# Level 6 — Memory Management & Common Traps

## Q21. Memory Leaks in Flutter and How to Prevent Them

### The Most Common Causes of Memory Leaks:
1. **Uncancelled \`StreamSubscription\`s**: Always call \`subscription.cancel()\` inside \`State.dispose()\`.
2. **Undisposed Controllers**: \`AnimationController\`, \`TextEditingController\`, \`ScrollController\`, and \`FocusNode\` must be disposed in \`dispose()\`.
3. **\`ChangeNotifier\` / \`ValueNotifier\` Listeners**: Unremoved listeners keep closures pinned in memory.
4. **Capturing \`BuildContext\` Across Async Gaps**: Retaining unmounted element references.
5. **Static/Global Singletons Holding Listeners**: Never register UI closures without unregistering on exit.

---

# Level 7 — OOP, Dart 3 & SOLID Principles

## Q22. OOP in Dart: \`extends\` vs \`implements\` vs \`with\` (Mixins)

### The Three Composition Mechanisms
1. **\`extends\` (Class Inheritance)**:
   - Single inheritance only. Subclass inherits both method signatures and implementations from the superclass.
2. **\`implements\` (Interface Implementation)**:
   - Every class in Dart implicitly defines an interface! You can implement multiple classes.
   - When using \`implements\`, you **must provide your own concrete implementation for EVERY single method and field**; none of the superclass code is inherited.
3. **\`with\` (Mixins)**:
   - Mixins provide code reuse across multiple class hierarchies without subclassing.
   - The \`on\` keyword restricts which superclasses can apply the mixin: \`mixin Flying on Animal {}\`.

\`\`\`dart
abstract class Vehicle {
  void drive();
}

mixin Electric {
  int batteryLevel = 100;
  void charge() => batteryLevel = 100;
}

class Tesla extends Vehicle with Electric {
  @override
  void drive() => print('Driving silently with battery at \$batteryLevel%');
}
\`\`\`

---

## Q23. Dart 3 Modern Features: Sealed Classes, Records, and Pattern Matching

Dart 3 introduced landmark language features that transformed Flutter state management:

### 1. Sealed Classes & Exhaustive Pattern Matching
A \`sealed\` class can only be extended or implemented within the same file. The Dart compiler knows every possible subclass, allowing **exhaustive switch expressions** without a fallback \`default\` branch!

\`\`\`dart
sealed class NetworkState {}
class Initial extends NetworkState {}
class Loading extends NetworkState {}
class Success extends NetworkState {
  final List<String> items;
  Success(this.items);
}
class Failure extends NetworkState {
  final String error;
  Failure(this.error);
}

// Exhaustive Pattern Matching: Compiler enforces handling EVERY subclass!
Widget renderState(NetworkState state) {
  return switch (state) {
    Initial() => const Text('Ready to load'),
    Loading() => const CircularProgressIndicator(),
    Success(:final items) => Text('Loaded \${items.length} items'),
    Failure(:final error) => Text('Error: \$error'),
  };
}
\`\`\`

### 2. Records
Anonymous, immutable, composite types with destructuring:
\`\`\`dart
(String name, int age) getUser() => ('Alice', 28);

void main() {
  final (name, age) = getUser();
  print('\$name is \$age years old');
}
\`\`\`

---

## Q24. SOLID Principles in Flutter Architecture

### 1. Single Responsibility Principle (SRP)
- A class should have only one reason to change.
- **Flutter application**: Separate data fetching (\`UserRepository\`), state management (\`UserBloc\`), and UI presentation (\`UserProfileScreen\`). Never fetch HTTP data directly inside a Widget!

### 2. Open/Closed Principle (OCP)
- Open for extension, closed for modification.
- Define an abstract \`PaymentProcessor\` interface. Adding Google Pay or Apple Pay creates new classes implementing the interface without modifying existing checkout code.

### 3. Liskov Substitution Principle (LSP)
- Subtypes must be substitutable for their base types without altering correctness.
- Any implementation of \`AuthRepository\` (MockAuthRepository, FirebaseAuthRepository) must fulfill the contract without unexpected errors.

### 4. Interface Segregation Principle (ISP)
- Clients should not be forced to depend on methods they do not use.
- Split large monolithic interfaces into smaller, focused interfaces (\`ReaderRepository\` vs \`WriterRepository\`).

### 5. Dependency Inversion Principle (DIP)
- High-level modules should depend on abstractions, not concrete implementations.
- Inject an abstract \`ApiClient\` interface into your repository instead of hardcoding \`Dio()\` inside the constructor.

---

# Level 8 — Clean Architecture & Production Engineering

## Q25. Clean Architecture in Flutter

Clean Architecture separates code into three concentric rings, where dependencies only point inward:

\`\`\`text
┌────────────────────────────────────────────────────────┐
│  Presentation Layer (UI, Widgets, BLoC, Cubit)         │
├────────────────────────────────────────────────────────┤
│  Domain Layer (Entities, UseCases, Repository Contracts)│
├────────────────────────────────────────────────────────┤
│  Data Layer (Repository Impl, Data Sources: API, DB)   │
└────────────────────────────────────────────────────────┘
\`\`\`

1. **Domain Layer (Core)**:
   - Contains pure business logic: **Entities**, **UseCases**, and **Repository Interfaces**.
   - Zero external dependencies; knows nothing about Flutter, Dio, or SQLite!
2. **Data Layer**:
   - Implements Domain repository interfaces.
   - Manages **Remote Data Sources** (HTTP / GraphQL) and **Local Data Sources** (Drift / Hive / SharedPreferences).
3. **Presentation Layer**:
   - Widgets, screens, state management (BLoC/Cubit), and view models.

---

## Q26. Repository Pattern & Cache-First Sync Strategy

The Repository pattern provides an abstraction over data sources, centralizing caching and network strategy:

\`\`\`dart
abstract class ProductRepository {
  Future<List<Product>> getProducts({bool forceRefresh = false});
}

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;
  final ProductLocalDataSource localDataSource;

  ProductRepositoryImpl({required this.remoteDataSource, required this.localDataSource});

  @override
  Future<List<Product>> getProducts({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cached = await localDataSource.getCachedProducts();
      if (cached.isNotEmpty) return cached;
    }

    try {
      final fresh = await remoteDataSource.fetchProducts();
      await localDataSource.saveProducts(fresh);
      return fresh;
    } catch (e) {
      final fallback = await localDataSource.getCachedProducts();
      if (fallback.isNotEmpty) return fallback;
      rethrow;
    }
  }
}
\`\`\`

---

# Coding & Problem-Solving Questions

## Q27. Find Missing Number in an Array (1 to N)

### Problem
Given an array containing $N-1$ unique numbers from the range $1$ to $N$, find the missing number in $O(N)$ time and $O(1)$ space.

\`\`\`dart
int findMissingNumber(List<int> numbers) {
  final int n = numbers.length + 1;
  // Gauss formula: sum of 1 to n = n * (n + 1) / 2
  final int expectedSum = n * (n + 1) ~/ 2;
  final int actualSum = numbers.reduce((a, b) => a + b);
  return expectedSum - actualSum;
}

void main() {
  print(findMissingNumber([1, 2, 4, 5, 6])); // Output: 3
}
\`\`\`

---

## Q28. Find Duplicates in a List in O(N) Time

\`\`\`dart
List<int> findDuplicates(List<int> numbers) {
  final seen = <int>{};
  final duplicates = <int>{};

  for (final n in numbers) {
    if (!seen.add(n)) {
      duplicates.add(n);
    }
  }
  return duplicates.toList();
}

void main() {
  print(findDuplicates([1, 3, 4, 2, 2, 5, 3])); // Output: [2, 3]
}
\`\`\`

---

## Q29. Debouncing in Pure Dart Without Packages

### Problem:
How do you implement an input search debounce in Dart without third-party dependencies?

\`\`\`dart
import 'dart:async';

class Debouncer {
  final Duration delay;
  Timer? _timer;

  Debouncer({this.delay = const Duration(milliseconds: 300)});

  void run(void Function() action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void dispose() {
    _timer?.cancel();
  }
}
\`\`\`

---

# Rapid-Fire Revision

- **Flutter**: Google's UI toolkit that renders widgets directly to an OS canvas via C++ graphics engine (Impeller/Skia) without native OEM bridges.
- **Dart**: Object-oriented, client-optimized language with sound null safety, AOT/JIT dual compilation, generational GC, and an isolate event loop model.
- **Widget**: Immutable description/blueprint of a UI configuration.
- **Element**: Mutable lifecycle controller that links Widget to RenderObject and implements \`BuildContext\`.
- **RenderObject**: The rendering engine node that calculates layout constraints, sizing, painting, and hit testing.
- **const**: Compile-time constant, canonicalized in memory; \`const []\` is deeply immutable and calling \`.add()\` throws \`UnsupportedError\`.
- **final**: Runtime constant with reference immutability; the variable reference cannot change, but the object itself can be mutated.
- **pubspec.yaml Caret (\`^\`)**: Shorthand for SemVer ranges. \`^1.2.0\` means \`>=1.2.0 <2.0.0\`. For zero-major (\`^0.2.0\`), it means \`>=0.2.0 <0.3.0\`.
- **MethodChannel**: Asynchronous RPC request-response pattern returning a \`Future\` for single-shot native invocations.
- **EventChannel**: Asynchronous continuous stream returning a \`Stream\` for continuous native hardware/sensor updates; requires \`onCancel\` cleanup.
- **Microtask Queue**: Higher priority queue than Event Queue; microtasks run to completion before the next event loop tick is processed.
- **Isolate**: True multi-threaded execution context with separate memory heap communicating via message passing.
`;

fs.writeFileSync(path.resolve("src/content/guide.md"), guideContent, "utf-8");
console.log("Successfully generated comprehensive guide with all levels and coding questions!");
