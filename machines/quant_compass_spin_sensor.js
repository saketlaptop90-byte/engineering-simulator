import { copper, gold, glass } from '../utils/materials.js';

export function createQuantumCompass(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Shell
    const shellGeo = new THREE.IcosahedronGeometry(2, 1);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // NV Center Diamond Core
    const diamondGeo = new THREE.OctahedronGeometry(1);
    const diamond = new THREE.Mesh(diamondGeo, glass);
    group.add(diamond);

    // Microwave Antenna
    const antennaGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.rotation.x = Math.PI / 2;
    group.add(antenna);

    // Spin vectors (arrows)
    const dir = new THREE.Vector3(0, 1, 0);
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1.5;
    const hex = 0xff0000;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0.5, 0.3);
    group.add(arrowHelper);

    // Animation: Arrow precessing and diamond glowing
    const arrowTrack = new THREE.VectorKeyframeTrack(
        '.children[3].rotation[z]',
        [0, 1],
        [0, Math.PI * 2]
    );
    
    const shellTrack = new THREE.VectorKeyframeTrack(
        '.children[0].rotation[y]',
        [0, 2],
        [0, Math.PI * 2]
    );

    const clip = new THREE.AnimationClip('Precess', 2, [arrowTrack, shellTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
