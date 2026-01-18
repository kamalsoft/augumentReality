--- /dev/null
+++ /Users/kamalsoft/dev/agumentReality/ar-shop/README.md
@@ -0,0 +1,102 @@
+# AR Shop - Interactive 3D Product Viewer
+
+A Next.js application featuring an advanced 3D product viewer with Augmented Reality (AR) capabilities, physics interactions, and a fully immersive "Walk Mode".
+
+## Features
+
+### 1. Interactive 3D Viewer
+- **Orbit Controls**: Rotate, zoom, and pan around the product.
+- **Auto-Rotate**: Automatically spin the product for display.
+- **Dimensions Overlay**: Toggle real-world dimensions of the product.
+- **Material Editor**: Adjust roughness and metalness in real-time.
+- **Texture Upload**: Apply custom textures from your device to the product.
+
+### 2. Environment & Lighting
+- **Day/Night Cycle**: Simulate a full 24-hour lighting cycle.
+- **Lighting Controls**: Adjust intensity, direction, and shadow softness.
+- **Weather Systems**: Toggle Rain or Snow effects.
+- **Floor Materials**: Switch between Wood, Concrete, and Tile floors.
+- **Scenes**: Change the background environment (Studio, Living Room, Loft, etc.).
+
+### 3. Walk Mode (First/Third Person)
+Enter a game-like mode to explore the environment.
+- **Movement**: Virtual Joystick for movement.
+- **Sprint**: Double-tap joystick or use the Run button (Zap icon). Includes a "Ghost Trail" effect.
+- **Jump**: Jump over obstacles (Up Arrow).
+- **Crouch**: Sneak under obstacles (Down Arrow).
+- **Jetpack**: Fly vertically with fuel consumption (Rocket icon).
+- **Grappling Hook**: Pull yourself towards walls or ceilings (Anchor icon).
- **Drone Mode**: Fly freely in 3D space, ignoring gravity (Plane icon).
+- **Teleport**: Click on the floor to instantly move there.
+- **Camera Views**: Toggle between First-Person and Third-Person views (Eye icon).
+- **Flashlight**: Illuminate dark areas (Flashlight icon).
+
+### 4. Physics & Interaction
+- **Physics Mode**: Enable gravity and collisions for the product.
+- **Interactive Doors**: Doors open automatically on approach or via interaction. Some are locked and require a Key Card.
+- **Key Card System**: Find and collect key cards to unlock specific doors.
+- **Security Camera**: A camera that tracks the player's movement.
+- **Collision Sounds**: Audio feedback when bumping into objects.
+
+### 5. Visual Effects
+- **Night Vision**: Green-tinted, grainy vision for dark environments (NVG button).
+- **Thermal Vision**: Heat-map style vision that highlights interactive objects (Flame icon).
+- **Cinematic Mode**: Hides UI for a clean view.
+- **Snapshots**: Capture high-quality screenshots of your design.
+- **Video Recording**: Record WebM videos of your interaction.
+
+### 6. Productivity
+- **Voice Control**: Use voice commands like "Rotate", "Stop", "Red", "Blue", "Rain".
+- **Compare Mode**: View two products side-by-side.
+- **Save/Load Designs**: Save your customizations and load them later.
+
+## How to Use
+
+### General Controls
+- **Rotate**: Click and drag.
+- **Zoom**: Scroll or pinch.
+- **Reset**: Click the "Reset" button to restore default settings.
+
+### Walk Mode Controls
+1. Click the **Walk** button (Gamepad icon) to enter.
+2. **Move**: Drag the joystick in the bottom-left corner.
+3. **Interact**: Click the Hand icon to open doors or pick up items.
+4. **Jetpack**: Hold the Rocket icon to fly. Watch your fuel gauge!
+5. **Grapple**: Hold the Anchor icon to grapple towards the center of your screen.
+6. **Vision Modes**: Toggle NVG (Night Vision) or Thermal (Flame icon) for enhanced visibility.
+
+### Voice Commands
+Click the **Voice** button to enable microphone access, then speak:
+- "Rotate" / "Spin"
+- "Stop"
+- "Red", "Blue", "Green", "White", "Black" (Change product color)
+- "Rain", "Snow", "Clear" (Change weather)
+
+## Technical Stack
+- **Framework**: Next.js 14
+- **3D Engine**: Three.js with @react-three/fiber
+- **Physics**: @react-three/cannon
+- **UI Components**: Lucide React icons, Tailwind CSS
+- **State Management**: Zustand
+```

 