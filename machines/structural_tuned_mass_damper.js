import { materials } from '../utils/materials.js';

export function createTunedMassDamper(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main structural frame
    const frameGeo = new THREE.BoxGeometry(4, 6, 4);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Pendulum arm (cables)
    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.y = 2.8;

    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const cable1 = new THREE.Mesh(cableGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    cable1.position.set(-0.5, -2, 0);
    const cable2 = new THREE.Mesh(cableGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    cable2.position.set(0.5, -2, 0);
    
    pendulumGroup.add(cable1);
    pendulumGroup.add(cable2);

    // Mass block
    const massGeo = new THREE.BoxGeometry(2, 1.5, 2);
    const mass = new THREE.Mesh(massGeo, materials.concrete || new THREE.MeshStandardMaterial({ color: 0x666666 }));
    mass.position.y = -4;
    pendulumGroup.add(mass);

    group.add(pendulumGroup);

    // Dashpots (dampers)
    const damperGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const damper1 = new THREE.Mesh(damperGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    damper1.rotation.z = Math.PI / 2;
    damper1.position.set(-1.5, -1, 0);
    group.add(damper1);

    const damper2 = new THREE.Mesh(damperGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    damper2.rotation.z = Math.PI / 2;
    damper2.position.set(1.5, -1, 0);
    group.add(damper2);

    // Animation: Pendulum swinging
    const times = [];
    const values = [];
    for(let i=0; i<=20; i++) {
        const t = i * 0.2; // total 4 seconds
        times.push(t);
        const angle = Math.sin(t * Math.PI) * 0.3; // Swing angle
        const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, angle));
        values.push(quat.x, quat.y, quat.z, quat.w);
    }
    
    const swingTrack = new THREE.QuaternionKeyframeTrack(`${pendulumGroup.uuid}.quaternion`, times, values);
    const clip = new THREE.AnimationClip('PendulumSwing', 4, [swingTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
