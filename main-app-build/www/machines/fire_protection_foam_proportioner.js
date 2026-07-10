import { materials } from '../utils/materials.js';

export function createFoamProportioner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const redMat = (materials && materials.redPaint) || new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const brassMat = (materials && materials.brass) || new THREE.MeshStandardMaterial({ color: 0xb5a642 });
    const glassMat = (materials && materials.glass) || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });

    // Main Pipe
    const pipeGeom = new THREE.CylinderGeometry(1, 1, 6, 32);
    const pipe = new THREE.Mesh(pipeGeom, redMat);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Venturi section
    const venturiGeom = new THREE.CylinderGeometry(0.5, 1, 1, 32);
    const venturi1 = new THREE.Mesh(venturiGeom, brassMat);
    venturi1.rotation.z = Math.PI / 2;
    venturi1.position.set(-0.5, 0, 0);
    group.add(venturi1);

    const venturi2 = new THREE.Mesh(venturiGeom, brassMat);
    venturi2.rotation.z = -Math.PI / 2;
    venturi2.position.set(0.5, 0, 0);
    group.add(venturi2);

    // Foam Tank
    const tankGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const tank = new THREE.Mesh(tankGeom, redMat);
    tank.position.set(0, -3, 0);
    group.add(tank);

    // Sight Glass (Connecting tube)
    const tubeGeom = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const tube = new THREE.Mesh(tubeGeom, glassMat);
    tube.position.set(0, -1, 0);
    group.add(tube);

    // Flow Indicator
    const indicatorGeom = new THREE.BoxGeometry(0.1, 0.4, 0.4);
    const indicator = new THREE.Mesh(indicatorGeom, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
    indicator.position.set(0, -1, 0);
    indicator.name = "indicator";
    group.add(indicator);

    // Animation: Flow Indicator Spinning
    const times = [0, 0.5, 1];
    const indTrack = new THREE.QuaternionKeyframeTrack(
        `indicator.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0)).toArray()
        ]
    );

    const clip = new THREE.AnimationClip("Proportion", 1, [indTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
