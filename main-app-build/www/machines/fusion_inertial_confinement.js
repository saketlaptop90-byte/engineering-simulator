import { materials } from '../utils/materials.js';

export function createInertialConfinement(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Target Chamber
    const chamberGeometry = new THREE.SphereGeometry(8, 32, 32);
    const chamberMaterial = materials.aluminum || new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.3});
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    group.add(chamber);

    // Laser Beams
    const numLasers = 192;
    const lasers = new THREE.Group();
    lasers.name = 'laser_beams';
    
    for(let i = 0; i < numLasers; i++) {
        const phi = Math.acos(-1 + (2 * i) / numLasers);
        const theta = Math.sqrt(numLasers * Math.PI) * phi;
        
        const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8);
        const laserMat = materials.laser || new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.8});
        const laser = new THREE.Mesh(laserGeometry, laserMat);
        
        const x = 4 * Math.cos(theta) * Math.sin(phi);
        const y = 4 * Math.sin(theta) * Math.sin(phi);
        const z = 4 * Math.cos(phi);
        
        laser.position.set(x, y, z);
        laser.lookAt(0, 0, 0);
        laser.rotateX(Math.PI / 2);
        lasers.add(laser);
    }
    group.add(lasers);

    // Target Pellet
    const pelletGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const pellet = new THREE.Mesh(pelletGeo, materials.deuteriumTritium || new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x444444}));
    pellet.name = 'target_pellet';
    group.add(pellet);

    // Animation: Pellet implosion via scale tracking
    const implosionTrack = new THREE.VectorKeyframeTrack(
        'target_pellet.scale',
        [0, 0.5, 1],
        [1, 1, 1, 0.1, 0.1, 0.1, 1, 1, 1]
    );
    const clip = new THREE.AnimationClip('LaserImplosion', 1, [implosionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
