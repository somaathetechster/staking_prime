export default function DepositModal({ symbol, address, network }) {
  return (
    <div className="bg-brand-gray p-8 rounded-2xl border border-white/10 max-w-sm w-full">
      <div className="text-center space-y-4">
        <h3 className="text-white text-xl font-light">Deposit {symbol}</h3>
        <p className="text-gray-500 text-xs uppercase tracking-widest">Network: {network}</p>
        
        {/* QR Code Placeholder */}
        <div className="bg-white p-4 rounded-xl inline-block">
          <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
            {/* You would use a library like qrcode.react here */}
            <span className="text-black text-[10px]">QR CODE</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase">Your Unique {symbol} Address</label>
          <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
            <code className="text-brand-gold text-xs break-all">{address}</code>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 leading-relaxed">
          Only send {symbol} to this address via the {network} network. 
          Assets will appear in your account after 3 network confirmations.
        </p>
      </div>
    </div>
  );
}