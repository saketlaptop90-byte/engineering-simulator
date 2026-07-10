import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const podGlass = new THREE.MeshPhysicalMaterial({ color: 0xaaccff, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.5 }); // Ultra-clear acrylic
    const medicalSteel = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.3 }); // Sterile stainless steel
    const bioSilicone = new THREE.MeshPhysicalMaterial({ color: 0xffcccc, metalness: 0.0, roughness: 0.7, transmission: 0.5 }); // Synthetic umbilical/lining
    const oxygenPump = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });
    
    // VFX Materials
    const amnioticFluidVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }); 
    const heartbeatVFX = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Biometric monitor
    const nutrientFlowVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }); // Flow inside the umbilical

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumps = [];
    group.userData.animatedMeshes.fluid = null;
    group.userData.animatedMeshes.heartbeat = null;
    group.userData.animatedMeshes.umbilicalFlow = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Gestation Pod (Womb)
    // ==========================================
    const podGroup = new THREE.Group();
    
    // The main acrylic vessel (Egg/Capsule shaped)
    const vesselGeo = new THREE.CapsuleGeometry(1.0, 1.5, 32, 32);
    const vessel = new THREE.Mesh(vesselGeo, podGlass);
    podGroup.add(vessel);
    
    // Internal synthetic amniotic fluid (Slightly smaller capsule)
    const fluidGeo = new THREE.CapsuleGeometry(0.95, 1.45, 32, 32);
    const fluid = new THREE.Mesh(fluidGeo, amnioticFluidVFX);
    podGroup.add(fluid);
    group.userData.animatedMeshes.fluid = fluid;
    
    // Base and Top Caps
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.4, 32), medicalSteel);
    topCap.position.y = 1.6;
    const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.5, 32), medicalSteel);
    bottomCap.position.y = -1.6;
    podGroup.add(topCap, bottomCap);
    
    group.add(podGroup);
    
    parts.push({ mesh: vessel, name: "Synthetic Gestation Vessel", description: "Sterile, temperature-controlled acrylic pod.", function: "Provides an ex-vivo environment mimicking the maternal womb, filled with synthetic amniotic fluid."});

    // ==========================================
    // 2. PROCEDURAL CAD: Life Support & Oxygenation Pumps
    // ==========================================
    const lifeSupportGroup = new THREE.Group();
    lifeSupportGroup.position.set(0, -2.2, 0); // Mounted underneath
    
    // Main housing
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 2.0), medicalSteel);
    lifeSupportGroup.add(housing);
    
    // Oxygenator (Artificial Placenta)
    const oxygenator = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6).rotateZ(Math.PI/2), oxygenPump);
    oxygenator.position.set(0.6, 0.6, 0.5);
    lifeSupportGroup.add(oxygenator);
    
    // Blood/Nutrient peristaltic pumps
    for(let i=0; i<2; i++) {
        const pump = new THREE.Group();
        pump.position.set(-0.6, 0.6, -0.4 + (i*0.8));
        
        // Pump stator
        const stator = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.1, 16, 32, Math.PI), medicalSteel);
        stator.rotation.x = -Math.PI/2;
        pump.add(stator);
        
        // Spinning rotor with rollers
        const rotor = new THREE.Group();
        const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2), rubber); roller1.position.y = 0.15;
        const roller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2), rubber); roller2.position.y = -0.15;
        rotor.add(roller1, roller2);
        pump.add(rotor);
        
        lifeSupportGroup.add(pump);
        group.userData.animatedMeshes.pumps.push(rotor);
    }
    
    group.add(lifeSupportGroup);
    
    parts.push({ mesh: lifeSupportGroup.children[1], name: "Artificial Placenta & Oxygenator", description: "Hollow fiber membrane oxygenator.", function: "Removes CO2 and adds Oxygen directly to the umbilical blood supply without the need for lungs."});

    // ==========================================
    // 3. PROCEDURAL CAD: Synthetic Umbilical & Internal Sensors
    // ==========================================
    const umbilicalGroup = new THREE.Group();
    
    // The umbilical cord sweeping from the bottom cap into the center of the pod
    // We will build a curved tube
    class UmbilicalCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = Math.sin(t * Math.PI) * 0.4;
            const y = -1.5 + (t * 1.5); // Rises up from the bottom
            const z = Math.cos(t * Math.PI) * 0.2 - 0.2;
            return optionalTarget.set(x, y, z);
        }
    }
    
    const cordGeo = new THREE.TubeGeometry(new UmbilicalCurve(), 64, 0.08, 16, false);
    const cord = new THREE.Mesh(cordGeo, bioSilicone);
    umbilicalGroup.add(cord);
    
    // Nutrient flow VFX inside the cord
    // We create multiple small spheres that will travel along the curve
    const curve = new UmbilicalCurve();
    for(let i=0; i<10; i++) {
        const flow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), nutrientFlowVFX);
        flow.userData = { t: i / 10.0 };
        const pt = curve.getPoint(flow.userData.t);
        flow.position.copy(pt);
        umbilicalGroup.add(flow);
        group.userData.animatedMeshes.umbilicalFlow.push(flow);
    }
    
    // Internal Biometric Sensor array (at the top of the pod)
    const sensorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1), medicalSteel);
    sensorBase.position.y = 1.4;
    umbilicalGroup.add(sensorBase);
    
    // Heartbeat / Vitals LED indicator
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), heartbeatVFX);
    led.position.y = 1.3;
    umbilicalGroup.add(led);
    group.userData.animatedMeshes.heartbeat = led;
    
    group.add(umbilicalGroup);
    
    parts.push({ mesh: cord, name: "Synthetic Umbilical Cord", description: "Bio-compatible silicone tubing.", function: "Delivers oxygenated blood, specialized nutrients, and growth hormones directly to the developing fetus."});

    // ==========================================
    // 4. PROCEDURAL CAD: Medical Tubing & Wiring Harnesses
    // ==========================================
    // Instead of bolts, we route complex IV lines and data cables around the outside
    const tubingGroup = new THREE.Group();
    
    for(let i=0; i<5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        // Tubes running from the life support base up to the top cap
        class TubeCurve extends THREE.Curve {
            constructor(a) { super(); this.a = a; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const r = 1.1; // Just outside the acrylic pod
                const x = r * Math.cos(this.a);
                const z = r * Math.sin(this.a);
                const y = -1.6 + (t * 3.2); // From bottom cap to top cap
                return optionalTarget.set(x, y, z);
            }
        }
        const tubeGeo = new THREE.TubeGeometry(new TubeCurve(angle), 32, 0.03, 8, false);
        const tube = new THREE.Mesh(tubeGeo, plastic);
        tubingGroup.add(tube);
        
        // Add some inline fluid filters / sensors to the tubes
        if (i % 2 === 0) {
            const filter = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15), chrome);
            const pt = new TubeCurve(angle).getPoint(0.5);
            filter.position.copy(pt);
            tubingGroup.add(filter);
        }
    }
    group.add(tubingGroup);
    
    parts.push({ mesh: tubingGroup.children[0], name: "Extracorporeal Fluid Lines", description: "Sterile polyurethane medical tubing.", function: "Routes synthetic blood, dialysate, and amniotic fluid between the life support block and the pod." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Peristaltic pumps spinning
            group.userData.animatedMeshes.pumps.forEach(rotor => {
                rotor.rotation.z += 2.0 * speed;
            });
            
            // Nutrient flow through the umbilical cord
            group.userData.animatedMeshes.umbilicalFlow.forEach(flow => {
                flow.userData.t += 0.01 * speed;
                if (flow.userData.t > 1.0) flow.userData.t = 0.0;
                
                // Opacity pulses slightly
                flow.material.opacity = 0.4 + Math.sin(timeAcc * 10) * 0.2;
                
                const pt = curve.getPoint(flow.userData.t);
                flow.position.copy(pt);
            });
            
            // Biometric heartbeat monitor (Simulating fetal heart rate, ~140 BPM)
            // Double beat (lub-dub)
            const beatTime = (timeAcc * 2.5 * speed) % 1.0;
            if (beatTime < 0.1 || (beatTime > 0.2 && beatTime < 0.3)) {
                group.userData.animatedMeshes.heartbeat.material.opacity = 1.0;
            } else {
                group.userData.animatedMeshes.heartbeat.material.opacity = 0.1;
            }
            
            // Amniotic fluid gently swirls/convects to maintain even temperature
            group.userData.animatedMeshes.fluid.rotation.y = timeAcc * 0.2 * speed;
            
        } else {
            // Idle (Life support critically offline!)
            group.userData.animatedMeshes.pumps.forEach(rotor => {
                rotor.rotation.z *= 0.95;
            });
            group.userData.animatedMeshes.umbilicalFlow.forEach(flow => flow.material.opacity = 0);
            group.userData.animatedMeshes.heartbeat.material.opacity = 0;
            group.userData.animatedMeshes.fluid.rotation.y *= 0.95;
        }
    };

    group.userData.parts = parts;
    return group;
}
