import { materials } from '../utils/materials.js';

export function createIcePenetratingRadarAntenna(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central mast
    const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const mast = new THREE.Mesh(mastGeo, materials.aluminum || new THREE.MeshStandardMaterial({color: 0xdddddd}));
    group.add(mast);

    // Radar dipoles
    const dipoles = new THREE.Group();
    for(let i=0; i<4; i++) {
        const dipoleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const dipole = new THREE.Mesh(dipoleGeo, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
        dipole.rotation.z = Math.PI / 2;
        dipole.position.y = -1 + i * 0.6;
        
        // cross element
        const crossGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const cross = new THREE.Mesh(crossGeo, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
        cross.rotation.x = Math.PI / 2;
        cross.position.y = -1 + i * 0.6;
        
        dipoles.add(dipole);
        dipoles.add(cross);
    }
    group.add(dipoles);

    // Base electronics box
    const boxGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    const box = new THREE.Mesh(boxGeo, materials.titanium || new THREE.MeshStandardMaterial({color: 0x666666}));
    box.position.y = 1.6;
    group.add(box);

    // Animation: Antenna rotating/scanning
    const times = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const rotValues = [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w];
    const track = new THREE.QuaternionKeyframeTrack(`${group.uuid}.quaternion`, times, rotValues);
    
    const clip = new THREE.AnimationClip('RadarScan', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
