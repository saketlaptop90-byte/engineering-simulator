import { materials } from '../utils/materials.js';

export function createDelugeValve(THREE) {
    const group = new THREE.Group();
    group.name = "DelugeValve";
    
    // Body
    const bodyGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const body = new THREE.Mesh(bodyGeo, materials.castIron || new THREE.MeshStandardMaterial({color: 0xaa0000}));
    group.add(body);
    
    // Flanges
    const flangeGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const topFlange = new THREE.Mesh(flangeGeo, materials.castIron || new THREE.MeshStandardMaterial({color: 0xaa0000}));
    topFlange.position.y = 3;
    group.add(topFlange);
    
    const bottomFlange = new THREE.Mesh(flangeGeo, materials.castIron || new THREE.MeshStandardMaterial({color: 0xaa0000}));
    bottomFlange.position.y = -3;
    group.add(bottomFlange);
    
    // Diaphragm Chamber
    const chamberGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const chamber = new THREE.Mesh(chamberGeo, materials.brass || new THREE.MeshStandardMaterial({color: 0xb5a642}));
    chamber.position.set(2, 0, 0);
    chamber.rotation.z = -Math.PI / 2;
    group.add(chamber);
    
    // Valve stem
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const stem = new THREE.Mesh(stemGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    stem.position.set(0, 1.5, 0);
    group.add(stem);
    
    // Animations
    const animationClips = [];
    
    // Stem moving up and down
    const stemTrack = new THREE.VectorKeyframeTrack(
        stem.uuid + '.position',
        [0, 1, 2],
        [
            0, 1.5, 0,
            0, 2.5, 0,
            0, 1.5, 0
        ]
    );
    
    const clip = new THREE.AnimationClip('DelugeActivation', 2, [stemTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
