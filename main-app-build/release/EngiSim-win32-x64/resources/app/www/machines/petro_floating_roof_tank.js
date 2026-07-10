import { materials } from '../utils/materials.js';

export function createFloatingRoofTank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank shell
    const shellGeo = new THREE.CylinderGeometry(10, 10, 8, 32, 1, true);
    const shellMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 4;
    group.add(shell);

    // Tank bottom
    const bottomGeo = new THREE.CircleGeometry(10, 32);
    const bottomMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    group.add(bottom);

    // Floating Roof
    const roofGeo = new THREE.CylinderGeometry(9.8, 9.8, 0.5, 32);
    const roofMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1;
    roof.name = 'floating_roof';
    group.add(roof);

    // Fluid level (optional representation)
    const fluidGeo = new THREE.CylinderGeometry(9.8, 9.8, 7, 32);
    const fluidMat = materials.crudeOil || new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.8 });
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.y = 3.5;
    fluid.name = 'fluid';

    // Roof floating animation
    const roofTracks = [];
    const times = [0, 5, 10];
    const values = [
        roof.position.x, 1, roof.position.z,
        roof.position.x, 7, roof.position.z,
        roof.position.x, 1, roof.position.z
    ];
    
    const positionTrack = new THREE.VectorKeyframeTrack(`${roof.name}.position`, times, values);
    roofTracks.push(positionTrack);

    const clip = new THREE.AnimationClip('RoofFloating', 10, roofTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
