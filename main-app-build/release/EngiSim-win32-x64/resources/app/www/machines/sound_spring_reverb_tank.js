import * as materials from '../utils/materials.js';

export function createSpringReverbTank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank chassis
    const tankGeo = new THREE.BoxGeometry(8, 1, 3);
    const tankMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.7 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);

    // Transducers
    const transGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const transMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xc87333 });
    const transLeft = new THREE.Mesh(transGeo, transMat);
    transLeft.position.set(-3.2, 0.2, 0);
    group.add(transLeft);

    const transRight = new THREE.Mesh(transGeo, transMat);
    transRight.position.set(3.2, 0.2, 0);
    group.add(transRight);

    // Springs
    const springs = [];
    const springCount = 3;
    const springRadius = 0.15;
    const springLength = 6.4;
    const turns = 40;

    const springPath = new THREE.Curve();
    springPath.getPoint = function (t) {
        const x = (t - 0.5) * springLength;
        const angle = t * turns * Math.PI * 2;
        const y = Math.sin(angle) * springRadius;
        const z = Math.cos(angle) * springRadius;
        return new THREE.Vector3(x, y, z);
    };

    const springGeo = new THREE.TubeGeometry(springPath, 200, 0.02, 8, false);
    const springMat = materials.shinyMetal || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });

    for (let i = 0; i < springCount; i++) {
        const spring = new THREE.Mesh(springGeo, springMat);
        spring.position.set(0, 0.6, (i - 1) * 0.8);
        group.add(spring);
        springs.push(spring);
    }

    // Animation: Springs wiggling
    const times = [0, 0.1, 0.2, 0.3, 0.4];
    springs.forEach((spring, index) => {
        const offset = index * 0.05;
        const values = [
            spring.position.y,
            spring.position.y + 0.1,
            spring.position.y - 0.1,
            spring.position.y + 0.05,
            spring.position.y
        ];
        const track = new THREE.NumberKeyframeTrack(`${spring.uuid}.position[y]`, times.map(t => t + offset), values);
        const clip = new THREE.AnimationClip(`spring_wobble_${index}`, 0.5, [track]);
        animationClips.push(clip);
    });

    return { group, animationClips };
}
