import { materials } from '../utils/materials.js';

export function createCometTug(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main hull
    const hullGeo = new THREE.CylinderGeometry(15, 20, 80, 16);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, materials.metallic || new THREE.MeshStandardMaterial({color: 0x888888}));
    group.add(hull);

    // Grappler arms at the front
    const armGeo = new THREE.BoxGeometry(5, 40, 5);
    const armMat = materials.metallicDark || new THREE.MeshStandardMaterial({color: 0x444444});
    
    const grappleTracks = [];
    for (let i = 0; i < 4; i++) {
        const armPivot = new THREE.Group();
        armPivot.position.set(0, 0, 40);
        armPivot.rotation.z = (i * Math.PI) / 2;
        
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.y = 15; // move out
        arm.position.z = 10;
        arm.rotation.x = -Math.PI / 8; // pointing slightly inwards initially
        arm.name = `arm_${i}`;
        
        armPivot.add(arm);
        group.add(armPivot);
        
        // Let's animate arm pivoting
        const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 8, 0, 0));
        const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 4, 0, 0)); // open wide
        const track = new THREE.QuaternionKeyframeTrack(`arm_${i}.quaternion`, [0, 2, 4], [
            qStart.x, qStart.y, qStart.z, qStart.w,
            qEnd.x, qEnd.y, qEnd.z, qEnd.w,
            qStart.x, qStart.y, qStart.z, qStart.w
        ]);
        grappleTracks.push(track);
    }
    
    animationClips.push(new THREE.AnimationClip('Grapple', 4, grappleTracks));

    // Engine thrusters
    const engineGeo = new THREE.CylinderGeometry(8, 12, 15, 16);
    engineGeo.rotateX(Math.PI / 2);
    const engine = new THREE.Mesh(engineGeo, armMat);
    engine.position.z = -47.5;
    group.add(engine);

    // Thruster flame
    const flameGeo = new THREE.ConeGeometry(10, 40, 16);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = materials.energy || new THREE.MeshBasicMaterial({color: 0xff8800, transparent: true, opacity: 0.9});
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.z = -75;
    flame.name = 'flame';
    group.add(flame);

    // Flame flicker animation
    const scaleTrack = new THREE.VectorKeyframeTrack(`flame.scale`, [0, 0.1, 0.2, 0.3], [
        1, 1, 1,
        1.2, 1.2, 1.5,
        0.9, 0.9, 1.2,
        1, 1, 1
    ]);
    const engineClip = new THREE.AnimationClip('EngineThrust', 0.3, [scaleTrack]);
    animationClips.push(engineClip);

    return { group, animationClips };
}
