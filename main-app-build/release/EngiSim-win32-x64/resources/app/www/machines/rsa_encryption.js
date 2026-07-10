export function createRSAEncryption(THREE) {
    const group = new THREE.Group();
    
    const parts = [];

    // Colors
    const colorPrime = 0x8e44ad; // Purple
    const colorKeyGen = 0x2980b9; // Blue
    const colorPubKey = 0x27ae60; // Green
    const colorPrivKey = 0xc0392b; // Red
    const colorClient = 0x7f8c8d; // Grey
    const colorPlaintext = 0xecf0f1; // White
    const colorEngine = 0xf39c12; // Orange
    const colorCiphertext = 0x2c3e50; // Dark
    
    // 1. Prime Number Generator
    const primeGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const primeMat = new THREE.MeshStandardMaterial({ color: colorPrime });
    const primeGen = new THREE.Mesh(primeGeom, primeMat);
    primeGen.position.set(0, 4, -2);
    group.add(primeGen);
    parts.push({ name: "Prime Number Generator", description: "Generates large random prime numbers 'p' and 'q'.", object: primeGen });

    // 2. Key Generator
    const keyGenGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const keyGenMat = new THREE.MeshStandardMaterial({ color: colorKeyGen });
    const keyGen = new THREE.Mesh(keyGenGeom, keyGenMat);
    keyGen.position.set(0, 2, -2);
    group.add(keyGen);
    parts.push({ name: "Key Generator", description: "Computes modulus n = p*q, public exponent e, and private exponent d.", object: keyGen });

    // 3. Public Key Server
    const pubKeyGeom = new THREE.BoxGeometry(1, 2, 1);
    const pubKeyMat = new THREE.MeshStandardMaterial({ color: colorPubKey });
    const pubKeyServer = new THREE.Mesh(pubKeyGeom, pubKeyMat);
    pubKeyServer.position.set(-3, 2, -2);
    group.add(pubKeyServer);
    parts.push({ name: "Public Key Server", description: "Distributes the public key (n, e) to anyone who wants to send an encrypted message.", object: pubKeyServer });

    // 4. Private Key Vault
    const privKeyGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const privKeyMat = new THREE.MeshStandardMaterial({ color: colorPrivKey });
    const privKeyVault = new THREE.Mesh(privKeyGeom, privKeyMat);
    privKeyVault.position.set(3, 2, -2);
    group.add(privKeyVault);
    parts.push({ name: "Private Key Vault", description: "Securely stores the private key (n, d) which must never be shared.", object: privKeyVault });

    // 5. Sender Client
    const clientGeom = new THREE.BoxGeometry(2, 1.5, 1);
    const clientMat = new THREE.MeshStandardMaterial({ color: colorClient });
    const senderClient = new THREE.Mesh(clientGeom, clientMat);
    senderClient.position.set(-5, 0, 0);
    group.add(senderClient);
    parts.push({ name: "Sender Client", description: "The origin of the plaintext message to be securely transmitted.", object: senderClient });

    // 6. Plaintext Data
    const plainGeom = new THREE.BoxGeometry(0.5, 0.3, 0.1);
    const plainMat = new THREE.MeshStandardMaterial({ color: colorPlaintext });
    const plaintext = new THREE.Mesh(plainGeom, plainMat);
    plaintext.position.set(-5, 1, 0);
    group.add(plaintext);
    parts.push({ name: "Plaintext Data", description: "The original, readable message.", object: plaintext });

    // 7. Encryption Engine
    const encEngineGeom = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
    const engineMat = new THREE.MeshStandardMaterial({ color: colorEngine });
    const encEngine = new THREE.Mesh(encEngineGeom, engineMat);
    encEngine.position.set(-2, 0, 0);
    group.add(encEngine);
    parts.push({ name: "Encryption Engine", description: "Encrypts plaintext using the recipient's public key (c = m^e mod n).", object: encEngine });

    // 8. Ciphertext Data
    const cipherGeom = new THREE.OctahedronGeometry(0.4);
    const cipherMat = new THREE.MeshStandardMaterial({ color: colorCiphertext });
    const ciphertext = new THREE.Mesh(cipherGeom, cipherMat);
    ciphertext.position.set(-2, 1, 0);
    ciphertext.visible = false;
    group.add(ciphertext);
    parts.push({ name: "Ciphertext Data", description: "The encrypted, unreadable message transmitted over the network.", object: ciphertext });

    // 9. Decryption Engine
    const decEngineGeom = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
    const decEngine = new THREE.Mesh(decEngineGeom, engineMat);
    decEngine.position.set(2, 0, 0);
    group.add(decEngine);
    parts.push({ name: "Decryption Engine", description: "Decrypts ciphertext using the private key (m = c^d mod n).", object: decEngine });

    // 10. Receiver Client
    const receiverClient = new THREE.Mesh(clientGeom, clientMat);
    receiverClient.position.set(5, 0, 0);
    group.add(receiverClient);
    parts.push({ name: "Receiver Client", description: "The destination where the plaintext message is read.", object: receiverClient });

    // Add some connecting paths (lines)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
    const lines = [
        [[-5, 0, 0], [-2, 0, 0]], // Sender to Enc
        [[-2, 0, 0], [2, 0, 0]],  // Enc to Dec
        [[2, 0, 0], [5, 0, 0]],   // Dec to Recv
        [[0, 4, -2], [0, 2, -2]], // Prime to KeyGen
        [[0, 2, -2], [-3, 2, -2]],// KeyGen to PubKey
        [[0, 2, -2], [3, 2, -2]], // KeyGen to PrivKey
        [[-3, 2, -2], [-2, 0, 0]],// PubKey to Enc
        [[3, 2, -2], [2, 0, 0]]   // PrivKey to Dec
    ];

    lines.forEach(pts => {
        const geom = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
        const line = new THREE.Line(geom, lineMat);
        group.add(line);
    });

    // Animation mixin
    const mixin = {
        tick(time) {
            const t = (time * 1.5) % 10;
            
            encEngine.rotation.z = time;
            decEngine.rotation.z = -time;
            ciphertext.rotation.x = time;
            ciphertext.rotation.y = time;

            if (t < 2) {
                // At sender
                plaintext.visible = true;
                ciphertext.visible = false;
                plaintext.position.set(-5, 1, 0);
            } else if (t < 3) {
                // Moving to enc
                plaintext.visible = true;
                ciphertext.visible = false;
                const p = (t - 2) / 1;
                plaintext.position.set(-5 + 3*p, 1, 0);
            } else if (t < 5) {
                // Encrypting
                plaintext.visible = false;
                ciphertext.visible = true;
                ciphertext.position.set(-2, 1, 0);
            } else if (t < 7) {
                // Moving to dec
                plaintext.visible = false;
                ciphertext.visible = true;
                const p = (t - 5) / 2;
                ciphertext.position.set(-2 + 4*p, 1, 0);
            } else if (t < 8) {
                // Decrypting
                plaintext.visible = true;
                ciphertext.visible = false;
                plaintext.position.set(2, 1, 0);
            } else if (t < 9) {
                // Moving to Recv
                plaintext.visible = true;
                ciphertext.visible = false;
                const p = (t - 8) / 1;
                plaintext.position.set(2 + 3*p, 1, 0);
            } else {
                // At Recv
                plaintext.visible = true;
                ciphertext.visible = false;
                plaintext.position.set(5, 1, 0);
            }
        }
    };

    group.tick = mixin.tick;
    group.parts = parts;

    // Quiz Questions
    group.questions = [
        {
            question: "In RSA encryption, which keys are required to successfully send and receive a confidential message?",
            options: [
                "Sender's Public Key to encrypt, Sender's Private Key to decrypt",
                "Receiver's Public Key to encrypt, Receiver's Private Key to decrypt",
                "Receiver's Private Key to encrypt, Receiver's Public Key to decrypt",
                "A shared symmetric key"
            ],
            correctAnswer: 1,
            explanation: "The sender uses the receiver's public key to encrypt the message. Only the receiver's private key can decrypt it."
        },
        {
            question: "What mathematical problem forms the basis of RSA's security?",
            options: [
                "The difficulty of solving discrete logarithms",
                "The difficulty of factoring large composite numbers",
                "The difficulty of generating large prime numbers",
                "The difficulty of computing modular exponentiation"
            ],
            correctAnswer: 1,
            explanation: "RSA's security relies on the practical difficulty of factoring the product of two large prime numbers."
        },
        {
            question: "If a public key is (n, e), what does 'n' represent?",
            options: [
                "A large prime number",
                "The private exponent",
                "The product of two large prime numbers",
                "The plaintext message"
            ],
            correctAnswer: 2,
            explanation: "The modulus 'n' is calculated by multiplying two distinct prime numbers, p and q (n = p*q)."
        },
        {
            question: "During RSA key generation, how is the private exponent 'd' calculated?",
            options: [
                "It is a random prime number.",
                "It is the inverse of e modulo n.",
                "It is the modular multiplicative inverse of e modulo Euler's totient of n.",
                "It is e multiplied by n."
            ],
            correctAnswer: 2,
            explanation: "The private exponent 'd' satisfies the congruence e*d ≡ 1 (mod φ(n)), meaning it is the modular multiplicative inverse of e modulo φ(n)."
        },
        {
            question: "What happens if someone discovers the two prime numbers (p and q) used to generate an RSA keypair?",
            options: [
                "They can calculate the private key and decrypt all messages.",
                "They can only decrypt future messages.",
                "Nothing, the security relies on e and d.",
                "They can change the public key."
            ],
            correctAnswer: 0,
            explanation: "If p and q are known, one can compute φ(n) = (p-1)(q-1) and then easily calculate the private key 'd'."
        },
        {
            question: "Which of the following describes the encryption step in RSA?",
            options: [
                "c = m^d mod n",
                "c = m^e mod n",
                "c = e^m mod n",
                "c = n^e mod m"
            ],
            correctAnswer: 1,
            explanation: "Ciphertext 'c' is generated by raising the plaintext message 'm' to the power of the public exponent 'e' modulo 'n'."
        }
    ];

    return group;
}
