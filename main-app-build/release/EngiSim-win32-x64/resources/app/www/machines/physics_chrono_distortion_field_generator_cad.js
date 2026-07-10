import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const containmentRingMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 }); // Hyper-dense osmium alloy
    const emitterNodeMat = new THREE.MeshPhysicalMaterial({ color: 0xaa8833, metalness: 0.8, roughness: 0.4 }); // Gold-plated chroniton emitters
    const exoticMatterCoreMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.0, roughness: 0.0, clearcoat: 1.0 }); // Negative mass core
    const stabilizationStrutMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.7, roughness: 0.5 }); // Support frame
    
    // VFX Materials
    const spacetimeLensingVFX = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.0, transmission: 1.0, ior: 2.5, thickness: 1.0 }); // Gravitational lensing distortion
    const chronitonFieldVFX = new THREE.MeshBasicMaterial({ color: 0x5500ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }); // Time dilation bubble
    const energyArcVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Electrical arcing

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rings = [];
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.lens = null;
    group.userData.animatedMeshes.bubble = null;
    group.userData.animatedMeshes.arcs = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Exotic Matter Containment Rings
    // ==========================================
    // Three massive nested rings on a gimbal system
    const gimbalGroup = new THREE.Group();
    
    for(let i=0; i<3; i++) {
        const ringGroup = new THREE.Group();
        const r = 1.5 - (i * 0.3); // Decreasing radii
        
        // The main physical ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.1, 32, 64), containmentRingMat);
        ringGroup.add(ring);
        
        // Emitter Nodes mounted on the ring
        const numNodes = 8;
        for(let j=0; j<numNodes; j++) {
            const angle = (j * Math.PI * 2) / numNodes;
            const node = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25).rotateX(Math.PI/2), emitterNodeMat);
            node.position.set(r * Math.cos(angle), r * Math.sin(angle), 0);
            node.lookAt(0,0,0);
            ringGroup.add(node);
        }
        
        // Energy arcs between nodes (VFX)
        for(let j=0; j<numNodes; j++) {
            const angle1 = (j * Math.PI * 2) / numNodes;
            const angle2 = ((j+1) * Math.PI * 2) / numNodes;
            // Draw a curved line between them
            class ArcCurve extends THREE.Curve {
                getPoint(t, optionalTarget = new THREE.Vector3()) {
                    const angle = angle1 + t * (angle2 - angle1);
                    const R = r + (Math.sin(t * Math.PI) * 0.1); // Bulges outward slightly
                    return optionalTarget.set(R * Math.cos(angle), R * Math.sin(angle), 0);
                }
            }
            const arc = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(), 16, 0.02, 4, false), energyArcVFX);
            ringGroup.add(arc);
            group.userData.animatedMeshes.arcs.push(arc);
        }
        
        gimbalGroup.add(ringGroup);
        group.userData.animatedMeshes.rings.push(ringGroup);
    }
    
    // Heavy base and struts supporting the gimbal
    const baseGroup = new THREE.Group();
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32), stabilizationStrutMat);
    basePlate.position.y = -1.8;
    baseGroup.add(basePlate);
    
    for(let side of [-1, 1]) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0), stabilizationStrutMat);
        strut.position.set(side * 1.7, -0.8, 0);
        strut.rotation.z = side * -0.2;
        baseGroup.add(strut);
    }
    
    group.add(gimbalGroup);
    group.add(baseGroup);
    parts.push({ mesh: gimbalGroup.children[0].children[0], name: "Osmium Gimbal Rings", description: "Hyper-dense, electromagnetically suspended containment rings.", function: "Rapidly rotates on three axes to generate a spherical containment field around the exotic matter core."});

    // ==========================================
    // 2. PROCEDURAL CAD: Exotic Matter Core & Lensing VFX
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The physical core (Looks like a perfect, reflective black sphere)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), exoticMatterCoreMat);
    coreGroup.add(core);
    group.userData.animatedMeshes.core = core;
    
    // Spacetime Lensing (A transparent sphere with extremely high Index of Refraction that visually warps the background)
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 64), spacetimeLensingVFX);
    coreGroup.add(lens);
    group.userData.animatedMeshes.lens = lens;
    
    // The Chroniton Field Bubble (Pulsing purple energy sphere)
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), chronitonFieldVFX);
    coreGroup.add(bubble);
    group.userData.animatedMeshes.bubble = bubble;
    
    group.add(coreGroup);
    parts.push({ mesh: core, name: "Negative-Mass Exotic Core", description: "A stabilized droplet of negative mass-energy.", function: "Creates a localized region of negative spacetime curvature. When spun, it effectively slows the flow of time within the bubble relative to the outside universe."});

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Gimbal Rings spin chaotically on all axes
            group.userData.animatedMeshes.rings[0].rotation.x += 1.0 * speed;
            group.userData.animatedMeshes.rings[1].rotation.y += 2.0 * speed;
            group.userData.animatedMeshes.rings[2].rotation.z += 3.0 * speed;
            
            // Energy arcs crackle
            group.userData.animatedMeshes.arcs.forEach(arc => {
                arc.material.opacity = 0.5 + (Math.random() * 0.5 * speed);
            });
            
            // 2. The Core pulses
            const coreScale = 1.0 + (Math.sin(timeAcc * 20 * speed) * 0.05);
            group.userData.animatedMeshes.core.scale.set(coreScale, coreScale, coreScale);
            
            // 3. Spacetime Lensing expands with throttle
            const lensScale = 1.0 + (speed * 0.5); // Gets larger, warping more space
            group.userData.animatedMeshes.lens.scale.set(lensScale, lensScale, lensScale);
            
            // 4. Chroniton Field Bubble flickers into existence
            group.userData.animatedMeshes.bubble.material.opacity = 0.4 * speed;
            // Wobble the bubble slightly
            group.userData.animatedMeshes.bubble.scale.x = 1.0 + (Math.sin(timeAcc * 5.0) * 0.05 * speed);
            group.userData.animatedMeshes.bubble.scale.y = 1.0 + (Math.cos(timeAcc * 4.0) * 0.05 * speed);
            group.userData.animatedMeshes.bubble.scale.z = 1.0 + (Math.sin(timeAcc * 6.0) * 0.05 * speed);
            
        } else {
            // Idle
            group.userData.animatedMeshes.rings.forEach(ring => {
                ring.rotation.x *= 0.95;
                ring.rotation.y *= 0.95;
                ring.rotation.z *= 0.95;
            });
            group.userData.animatedMeshes.arcs.forEach(arc => arc.material.opacity = 0);
            group.userData.animatedMeshes.core.scale.set(1,1,1);
            group.userData.animatedMeshes.lens.scale.set(1,1,1);
            group.userData.animatedMeshes.bubble.material.opacity = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
