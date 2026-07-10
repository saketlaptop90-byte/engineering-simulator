import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumHull = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.8, roughness: 0.5 }); // Deep sea pressure hull
    const syntacticFoam = new THREE.MeshPhysicalMaterial({ color: 0xddaa44, metalness: 0.1, roughness: 0.9 }); // Buoyancy material
    const sapphireViewports = new THREE.MeshPhysicalMaterial({ color: 0xaaaaff, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.6 }); // Pressure windows
    const thermalPiping = new THREE.MeshPhysicalMaterial({ color: 0xcc6633, metalness: 0.7, roughness: 0.4 }); // Hydrothermal tap pipes
    
    // VFX Materials
    const ventSmokeVFX = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.0 }); // Black smoker particulate
    const internalLightingVFX = new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.0 }); // Warm habitat lights
    const externalFloodlightVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Cutting through the abyss

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.smoke = [];
    group.userData.animatedMeshes.lights = [];
    group.userData.animatedMeshes.floods = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Pressure Spheres
    // ==========================================
    const habitatGroup = new THREE.Group();
    
    // Central Hub Sphere (Titanium, perfectly spherical to distribute extreme pressure)
    const hub = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), titaniumHull);
    habitatGroup.add(hub);
    
    // 3 Sub-modules attached via massive airlock bulkheads
    for(let i=0; i<3; i++) {
        const moduleGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 3;
        moduleGroup.rotation.y = -angle; // Point outward
        
        // The heavy airlock corridor
        const airlock = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8).rotateZ(Math.PI/2), titaniumHull);
        airlock.position.x = 1.3;
        moduleGroup.add(airlock);
        
        // Massive locking collar
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.1, 16, 32).rotateY(Math.PI/2), steel);
        collar.position.x = 1.3;
        moduleGroup.add(collar);
        
        // The sub-module sphere (Living, Lab, Engineering)
        const subSphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), titaniumHull);
        subSphere.position.x = 2.0;
        moduleGroup.add(subSphere);
        
        // Add a conical sapphire viewport looking outward
        const windowFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.2).rotateZ(Math.PI/2), steel);
        windowFrame.position.x = 2.75;
        moduleGroup.add(windowFrame);
        
        const viewport = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.15).rotateZ(Math.PI/2), sapphireViewports);
        viewport.position.x = 2.77;
        moduleGroup.add(viewport);
        
        // Warm internal light visible through the viewport
        const internalLight = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), internalLightingVFX);
        internalLight.position.x = 2.7;
        internalLight.rotation.y = Math.PI/2;
        moduleGroup.add(internalLight);
        group.userData.animatedMeshes.lights.push(internalLight);
        
        // External Floodlight mounted on the module
        const floodHousing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), steel);
        floodHousing.position.set(2.4, 0.6, 0);
        moduleGroup.add(floodHousing);
        
        const floodBeam = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.0, 16).rotateZ(-Math.PI/2), externalFloodlightVFX);
        floodBeam.position.set(3.8, 0.6, 0);
        moduleGroup.add(floodBeam);
        group.userData.animatedMeshes.floods.push(floodBeam);
        
        habitatGroup.add(moduleGroup);
    }
    
    // Giant Syntactic Foam buoyancy pack on top of the central hub
    const foamPack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), syntacticFoam);
    foamPack.position.y = 1.3;
    habitatGroup.add(foamPack);
    
    group.add(habitatGroup);
    parts.push({ mesh: hub, name: "Titanium Pressure Spheres", description: "Seamlessly forged 6-inch thick titanium hulls.", function: "Provides the only structural geometry capable of resisting the crushing 16,000 PSI pressure of the Mariana Trench."});
    parts.push({ mesh: habitatGroup.children[1].children[1], name: "Airlock Bulkheads", description: "Massive hydraulic locking collars.", function: "Seals off individual modules in the event of a catastrophic structural failure, saving the rest of the habitat."});

    // ==========================================
    // 2. PROCEDURAL CAD: Hydrothermal Vent Tap (Power & Heat)
    // ==========================================
    const engineeringGroup = new THREE.Group();
    
    // Instead of nuclear or battery, it taps a deep sea "Black Smoker"
    // The seafloor base plate
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.2, 32), darkSteel);
    basePlate.position.y = -2.5;
    engineeringGroup.add(basePlate);
    
    // The geothermal bore/tap going into the crust
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5), darkSteel);
    bore.position.y = -1.8;
    engineeringGroup.add(bore);
    
    // Complex thermal piping running from the tap up to the central hub
    // Heat exchangers
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        
        // Pipe routing up
        class PipeCurve extends THREE.Curve {
            constructor(a) { super(); this.a = a; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const r = 0.5 + (Math.sin(t * Math.PI) * 0.5); // Bulges out slightly
                const y = -1.5 + (t * 2.0); // Up to the hub bottom
                const x = r * Math.cos(this.a);
                const z = r * Math.sin(this.a);
                return optionalTarget.set(x, y, z);
            }
        }
        const pipeGeo = new THREE.TubeGeometry(new PipeCurve(angle), 16, 0.08, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, thermalPiping);
        engineeringGroup.add(pipe);
    }
    
    // The "Black Smoker" exhaust (Releasing the used geothermal fluid)
    const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8), darkSteel);
    exhaustPipe.position.set(0, -1.0, 0);
    // Angle it off to the side so it doesn't hit the hub
    exhaustPipe.rotation.z = Math.PI/4;
    exhaustPipe.position.x = 0.8;
    engineeringGroup.add(exhaustPipe);
    
    group.add(engineeringGroup);
    parts.push({ mesh: engineeringGroup.children[2], name: "Hydrothermal Vent Tap", description: "Geothermal heat exchangers.", function: "Draws 400°C superheated mineral water from the earth's crust to power the habitat's thermoelectric generators and provide life-sustaining heat in the freezing abyss."});

    // ==========================================
    // 3. PROCEDURAL CAD: Black Smoker VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Plumes of black mineral-rich smoke billowing out
    for(let i=0; i<15; i++) {
        const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), ventSmokeVFX);
        smoke.userData = { t: Math.random(), speed: 0.5 + Math.random() };
        // Start near the exhaust pipe tip
        vfxGroup.add(smoke);
        group.userData.animatedMeshes.smoke.push(smoke);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Habitat comes alive
            // Floodlights cut through the darkness
            group.userData.animatedMeshes.floods.forEach((flood, index) => {
                flood.material.opacity = 0.4 * speed;
                // Slowly pan the lights around
                flood.parent.rotation.y = -((index * Math.PI*2)/3) + Math.sin(timeAcc * 0.2) * 0.1;
                flood.parent.rotation.z = Math.cos(timeAcc * 0.3) * 0.05;
            });
            
            // Internal lights turn on (warm glow of life)
            group.userData.animatedMeshes.lights.forEach(light => {
                light.material.opacity = 0.8;
            });
            
            // Black Smoker exhaust (Geothermal tap active)
            group.userData.animatedMeshes.smoke.forEach(smoke => {
                smoke.userData.t += 0.02 * speed * smoke.userData.speed;
                if (smoke.userData.t > 1.0) smoke.userData.t = 0.0;
                
                // Tip of the exhaust pipe is roughly at x=1.3, y=-0.6
                const startX = 1.3;
                const startY = -0.6;
                
                // Rises up and spreads out (turbulent)
                smoke.position.x = startX + (smoke.userData.t * 2.0) + (Math.sin(timeAcc * 2.0 + smoke.userData.t * 10) * 0.5);
                smoke.position.y = startY + (smoke.userData.t * 6.0);
                smoke.position.z = Math.cos(timeAcc * 2.0 + smoke.userData.t * 10) * 0.5;
                
                // Expands
                const scale = 1.0 + (smoke.userData.t * 3.0);
                smoke.scale.set(scale, scale, scale);
                
                // Thick black smoke that fades
                smoke.material.opacity = (1.0 - smoke.userData.t) * 0.9 * speed;
            });
            
        } else {
            // Idle (Power failure / Emergency mode)
            group.userData.animatedMeshes.floods.forEach(flood => flood.material.opacity = 0);
            group.userData.animatedMeshes.lights.forEach(light => light.material.opacity = 0.1); // Emergency lighting only
            group.userData.animatedMeshes.smoke.forEach(smoke => smoke.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
