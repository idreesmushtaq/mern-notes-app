import {motion} from 'framer-motion';

export default function NoteCard({note, onEdit, onDelete, onPin, onFav}) {
    return (
        <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            className={`p-4 rounded shadow ${note.pinned ? "ring-2 ring-yellow-300" : "bg-white dark:bg-gray-800"}`}
        >
            <div className="flex justify-between ">
                <h3 className="font-semibold">{note.title}</h3>
                <div className="flex gap-2">
                    <button onclick={() => onPin(note._id)} className="text-sm">Pin</button>
                    <button onClick={() => onFav(note._id)} className="text-sm">Fav</button>
                    <button onClick={() => onEdit(note)} className="text-sm">Edit</button>
                    <button onclick={() => onDelete(note._id)} className="text-sam text-red-500">Delete</button>
                </div>
                </div>
            <p className="mt-2 text-sm">{note.content}</p>
            {note.image?.url && <img src={note.image.url} alt="Note Image" className="mt-3 max-h-40 object-cover rounded" />}
            <div className='mt-2 flex gap-2'>
                {note.tags?.map(tag => <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">#{tag}</span>)}
            </div>
        </motion.div>
    );
}