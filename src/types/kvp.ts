export  class KVP<K, V> {
    key: K
    val: V;

    public constructor(key: K, val: V) {
        this.key = key;
        this.val = val;
    }
}