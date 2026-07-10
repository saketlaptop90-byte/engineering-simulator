import { materials } from '../utils/materials.js';

export function createHalonRack(THREE) {
    const group = new THREE.Group();
    group.name = "HalonRack";
    
    // Rack Frame
    const frameGeo = new THREE.BoxGeometry(8, 0.5, 3);
    const frameBase = new THREE.Mesh(frameGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    frameBase.position.y = -3;
    group.add(frameBase);
    
    const frameTop = new THREE.Mesh(frameGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    frameTop.position.y = 3;
    group.add(frameTop);
    
    // Supports
    const supportGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    const support1 = new THREE.Mesh(supportGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    support1.position.set(-3.75, 0, -1.25);
    group.add(support1);
    
    const support2 = new THREE.Mesh(supportGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    support2.position.set(3.75, 0, -1.25);
    group.add(support2);
    
    // Cylinders and Actuators
    const cylinderGeo = new THREE.CylinderGeometry(0.8, 0.8, 5, 32);
    const manifoldGroup = new THREE.Group();
    
    for (let i = -1; i <= 1; i++) {
        const cylinder = new THREE.Mesh(cylinderGeo, materials.paintedRed || new THREE.MeshStandardMaterial({color: 0xff0000}));
        cylinder.position.set(i * 2.5, -0.5, 0);
        group.add(cylinder);
        
        // Valve at top
        const valveGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
        const valve = new THREE.Mesh(valveGeo, materials.brass || new THREE.MeshStandardMaterial({color: 0xb5a642}));
        valve.position.set(i * 2.5, 2.3, 0);
        group.add(valve);
        
        // Actuator
        const actuatorGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const actuator = new THREE.Mesh(actuatorGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
        actuator.position.set(i * 2.5, 2.6, 0);
        manifoldGroup.add(actuator);
    }
    
    group.add(manifoldGroup);
    
    // Animations
    const animationClips = [];
    
    const triggerTrack = new THREE.VectorKeyframeTrack(
        manifoldGroup.uuid + '.position',
        [0, 0.2, 0.4, 2],
        [
            0, 0, 0,
            0, -0.1, 0,
            0, -0.1, 0,
            0, 0, 0
        ]
    );
    
    const clip = new THREE.AnimationClip('HalonDischarge', 2, [triggerTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
