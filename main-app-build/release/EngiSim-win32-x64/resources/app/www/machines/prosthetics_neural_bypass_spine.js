import { carbonFiber, titanium, wireCoil, blueAccent } from '../utils/materials.js';

export function createNeuralBypassSpine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const spineBaseGeo = new THREE.BoxGeometry(1, 0.5, 0.5);
    const spineBase = new THREE.Mesh(spineBaseGeo, carbonFiber);
    group.add(spineBase);

    const vertebraeCount = 10;
    let currentParent = spineBase;
    
    const vertebraeTracks = [];

    for (let i = 0; i < vertebraeCount; i++) {
        const vertebraGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 16);
        const vertebra = new THREE.Mesh(vertebraGeo, titanium);
        vertebra.position.y = 0.6;
        vertebra.name = `Vertebra${i}`;
        
        const discGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
        const disc = new THREE.Mesh(discGeo, blueAccent);
        disc.position.y = -0.35;
        vertebra.add(disc);

        currentParent.add(vertebra);
        currentParent = vertebra;

        vertebraeTracks.push(
            new THREE.NumberKeyframeTrack(
                `Vertebra${i}.rotation[z]`,
                [0, 1, 2, 3, 4],
                [0, Math.PI / 32, 0, -Math.PI / 32, 0]
            )
        );
        vertebraeTracks.push(
            new THREE.NumberKeyframeTrack(
                `Vertebra${i}.rotation[x]`,
                [0, 2, 4],
                [0, Math.PI / 24, 0]
            )
        );
    }

    const brainInterfaceGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const brainInterface = new THREE.Mesh(brainInterfaceGeo, carbonFiber);
    brainInterface.position.y = 0.8;
    currentParent.add(brainInterface);

    const pulseLightGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
    const pulseLightMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true });
    const pulseLight = new THREE.Mesh(pulseLightGeo, pulseLightMat);
    pulseLight.position.y = 0.5;
    pulseLight.rotation.x = Math.PI / 2;
    pulseLight.name = "PulseLight";
    brainInterface.add(pulseLight);

    const pulseTrack = new THREE.NumberKeyframeTrack(
        'PulseLight.material.opacity',
        [0, 0.5, 1, 1.5, 2],
        [0.2, 1, 0.2, 1, 0.2]
    );

    const pulseScaleTrack = new THREE.VectorKeyframeTrack(
        'PulseLight.scale',
        [0, 1, 2],
        [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('FlexAndPulse', 4, [...vertebraeTracks, pulseTrack, pulseScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
