import { carbonFiber, titanium, wireCoil, plastic } from '../utils/materials.js';

export function createCochlearImplant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // External Processor Unit
    const processorGeo = new THREE.BoxGeometry(1, 1.5, 0.4);
    const processor = new THREE.Mesh(processorGeo, plastic);
    processor.position.set(-1.5, 0, 0);
    group.add(processor);

    const micGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const mic = new THREE.Mesh(micGeo, titanium);
    mic.position.set(0, 0.7, 0.2);
    mic.rotation.x = Math.PI / 2;
    processor.add(mic);

    // Transmitter Coil
    const coilBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const coilBase = new THREE.Mesh(coilBaseGeo, plastic);
    coilBase.position.set(0.5, 0.5, 0);
    coilBase.rotation.x = Math.PI / 2;
    group.add(coilBase);

    const transmitterGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
    const transmitter = new THREE.Mesh(transmitterGeo, wireCoil);
    transmitter.position.y = 0.1;
    transmitter.rotation.x = Math.PI / 2;
    coilBase.add(transmitter);

    // Wire connecting processor and coil
    const wirePathGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const wirePath = new THREE.Mesh(wirePathGeo, carbonFiber);
    wirePath.position.set(-0.5, 0.25, 0);
    wirePath.rotation.z = Math.PI / 2;
    group.add(wirePath);

    // Internal Receiver
    const receiverGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32);
    const receiver = new THREE.Mesh(receiverGeo, titanium);
    receiver.position.set(0.5, 0.5, -0.3);
    receiver.rotation.x = Math.PI / 2;
    group.add(receiver);

    // Electrode Array inside Cochlea
    const spiralGeo = new THREE.TorusKnotGeometry(0.5, 0.05, 100, 16, 2, 3);
    const electrodeArray = new THREE.Mesh(spiralGeo, wireCoil);
    electrodeArray.position.set(2, 0, -1);
    group.add(electrodeArray);

    // Sound Wave Visualization (Animations)
    const waveGeo = new THREE.RingGeometry(0.9, 1.0, 32);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, side: THREE.DoubleSide });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.position.set(0.5, 0.5, 0.1);
    wave.name = "SoundWave";
    group.add(wave);

    const waveScaleTrack = new THREE.VectorKeyframeTrack(
        'SoundWave.scale',
        [0, 1, 2],
        [0.1, 0.1, 0.1, 1.5, 1.5, 1.5, 0.1, 0.1, 0.1]
    );

    const waveOpacityTrack = new THREE.NumberKeyframeTrack(
        'SoundWave.material.opacity',
        [0, 1, 2],
        [1, 0, 1]
    );

    const clip = new THREE.AnimationClip('Transmit', 2, [waveScaleTrack, waveOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
