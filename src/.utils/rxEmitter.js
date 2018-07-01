function rxEmitter(subject, ...args) {
    subject.emit = () => subject.next.apply(subject, args)
    return subject
}

export default rxEmitter
