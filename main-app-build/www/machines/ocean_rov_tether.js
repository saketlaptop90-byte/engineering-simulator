import { materials } from '../utils/materials.js';

export function createROVTether(THREE) {
    const group = new THREE.Group();
    group.name = "ROV_System";
    const animationClips = [];

    const rovGroup = new THREE.Group();
    rovGroup.name = "ROV";
    group.add(rovGroup);

    const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 1.6);
    const body = new THREE.Mesh(bodyGeo, materials.primary || new THREE.MeshStandardMaterial({color: 0x0055ff}));
    rovGroup.add(body);

    // Thrusters
    const thrusterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const positions = [
        [-0.7, 0, 0.5], [0.7, 0, 0.5],
        [-0.7, 0, -0.5], [0.7, 0, -0.5],
        [0, 0.5, 0] // Vertical thruster
    ];

    positions.forEach((pos, idx) => {
        const thruster = new THREE.Mesh(thrusterGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
        thruster.position.set(...pos);
        if (idx < 4) thruster.rotation.x = Math.PI / 2;
        rovGroup.add(thruster);
    });

    // Tether
    const tetherCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.4, -0.8),
        new THREE.Vector3(0, 2, -2),
        new THREE.Vector3(0, 5, -3)
    ]);
    const tetherGeo = new THREE.TubeGeometry(tetherCurve, 20, 0.05, 8, false);
    const tether = new THREE.Mesh(tetherGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x111111}));
    rovGroup.add(tether); // Attach to ROV for now so it moves with it

    // Animation
    const hoverTrack = new THREE.VectorKeyframeTrack('ROV.position', [0, 2, 4], [0, 0, 0, 0, 0.5, 0.2, 0, 0, 0]);
    const rotTrack = new THREE.QuaternionKeyframeTrack('ROV.quaternion', 
        [0, 2, 4], 
        [...new THREE.Quaternion().toArray(), ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0.1, 0)).toArray(), ...new THREE.Quaternion().toArray()]
    );

    animationClips.push(new THREE.AnimationClip('Explore', 4, [hoverTrack, rotTrack]));

    return { group, animationClips };
}
