import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createFourStrokeEngineCylinder(THREE) {
    const group = new THREE.Group();
    group.name = "FourStrokeEngine";

    const block = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 16, 1, true), darkSteel);
    block.position.y = 3;
    block.material = block.material.clone();
    block.material.transparent = true;
    block.material.opacity = 0.3; // Glass-like casing to see inside
    group.add(block);

    const crank = new THREE.Group();
    crank.name = "Crank";
    group.add(crank);

    const crankHub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), brass);
    crankHub.rotation.x = Math.PI / 2;
    crank.add(crankHub);

    const crankPin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), aluminum);
    crankPin.position.set(1, 0, 0); 
    crankPin.rotation.x = Math.PI / 2;
    crank.add(crankPin);

    const pistonPivot = new THREE.Group();
    pistonPivot.name = "PistonPivot";
    group.add(pistonPivot);

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.5, 16), aluminum);
    piston.position.set(0, 0, 0);
    pistonPivot.add(piston);

    const duration = 2; 
    const steps = 32;
    const times = [];
    const crankVals = [];
    const pistonPosVals = [];

    const r = 1;
    const l = 3;

    for(let i=0; i<=steps; i++) {
        const t = (i/steps);
        times.push(t * duration);
        
        const theta = t * Math.PI * 4; 
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), theta);
        crankVals.push(q.x, q.y, q.z, q.w);

        const py = r * Math.cos(theta) + Math.sqrt(l*l - r*r*Math.pow(Math.sin(theta), 2));
        pistonPosVals.push(0, py, 0);
    }

    const tracks = [
        new THREE.QuaternionKeyframeTrack('Crank.quaternion', times, crankVals),
        new THREE.VectorKeyframeTrack('PistonPivot.position', times, pistonPosVals)
    ];

    const clip = new THREE.AnimationClip("EngineAction", duration, tracks);

    return { group, animationClips: [clip] };
}
