class Object
  def tainted?; false; end
  def taint; self; end
  def untaint; self; end
end
class File
  def self.exists?(path); exist?(path); end
end
class Dir
  def self.exists?(path); exist?(path); end
end
