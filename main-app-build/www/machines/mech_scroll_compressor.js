import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createScrollCompressor(THREE) {
    const group = new THREE.Group();
    
    // Procedural generation of an Archimedean spiral shape
    const generateScrollShape = () => {
        const shape = new THREE.Shape();
        const turns = 3;
        const a = 0.5; // inner radius
        const b = 0.6; // spacing
        const thickness = 0.4;
        
        // Outer curve
        shape.moveTo(a, 0);
        for(let t=0; t<=turns*Math.PI*2; t+=0.1){
            const r = a + b * (t / (Math.PI*2));
            shape.lineTo(r * Math.cos(t), r * Math.sin(t));
        }
        
        // Inner curve to create thickness
        for(let t=turns*Math.PI*2; t>=0; t-=0.1){
            const r = a + b * (t / (Math.PI*2)) - thickness;
            shape.lineTo(r * Math.cos(t), r * Math.sin(t));
        }
        return shape;
    };

    const extrudeSettings = { depth: 2.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const shape = generateScrollShape();
    
    // Fixed Scroll (Aluminum)
    const fixedScroll = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), aluminum);
    const fixedBase = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.5, 64), darkSteel);
    fixedBase.position.z = -0.25;
    fixedBase.rotation.x = Math.PI / 2;
    fixedScroll.add(fixedBase);
    group.add(fixedScroll);

    // Orbiting Scroll (Brass)
    const orbitingScroll = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), brass);
    orbitingScroll.name = "OrbitingScroll";
    orbitingScroll.rotation.z = Math.PI; // Interleaved with the fixed scroll
    
    const orbitRadius = 0.6; // Matches 'b' parameter
    orbitingScroll.position.set(orbitRadius, 0, 0.05); // Slight z-offset to prevent z-fighting
    
    const orbitingBase = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.5, 64), darkSteel);
    orbitingBase.position.z = 2.75;
    orbitingBase.rotation.x = Math.PI / 2;
    orbitingScroll.add(orbitingBase);
    group.add(orbitingScroll);

    const duration = 1.5;
    const times = [];
    const orbitVals = [];
    const steps = 60;
    
    // The orbiting scroll revolves in a circular path but DOES NOT rotate on its own axis.
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        
        const angle = -(t / duration) * Math.PI * 2;
        orbitVals.push(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0.05);
    }
    
    const orbitTrack = new THREE.VectorKeyframeTrack('OrbitingScroll.position', times, orbitVals);
    const clip = new THREE.AnimationClip('ScrollOperation', duration, [orbitTrack]);

    return { group, animationClips: [clip] };
}
