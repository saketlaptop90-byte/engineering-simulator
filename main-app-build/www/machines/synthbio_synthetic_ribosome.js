import { materials } from '../utils/materials.js';

export function createSyntheticRibosome(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Large subunit
    const largeGeo = new THREE.TorusKnotGeometry( 2, 0.6, 100, 16 );
    const largeMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xaa33aa, roughness: 0.7 });
    const largeSubunit = new THREE.Mesh( largeGeo, largeMat );
    largeSubunit.position.y = 1;
    group.add( largeSubunit );

    // Small subunit
    const smallGeo = new THREE.CapsuleGeometry( 1.2, 2, 16, 32 );
    const smallMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x882288, roughness: 0.7 });
    const smallSubunit = new THREE.Mesh( smallGeo, smallMat );
    smallSubunit.rotation.z = Math.PI / 2;
    smallSubunit.position.y = -1.5;
    group.add( smallSubunit );

    // mRNA strand
    const rnaGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, -0.25, 0),
            new THREE.Vector3(0, -0.25, 0),
            new THREE.Vector3(5, -0.25, 0)
        ]),
        20, 0.1, 8, false
    );
    const rnaMat = materials.highlight || new THREE.MeshStandardMaterial({ color: 0x00ffcc });
    const rna = new THREE.Mesh( rnaGeo, rnaMat );
    group.add( rna );

    // Animation: Translation process (subunits clamping)
    const times = [0, 1, 2, 3, 4];
    const largeTrack = new THREE.VectorKeyframeTrack(`${largeSubunit.uuid}.position`, times, [0,1,0, 0,0.5,0, 0,1,0, 0,0.5,0, 0,1,0]);
    const smallTrack = new THREE.VectorKeyframeTrack(`${smallSubunit.uuid}.position`, times, [0,-1.5,0, 0,-1,0, 0,-1.5,0, 0,-1,0, 0,-1.5,0]);

    const clip = new THREE.AnimationClip('Translation', 4, [largeTrack, smallTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
