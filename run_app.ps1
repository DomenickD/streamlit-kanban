Write-Host "Starting React Frontend..."
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "kanban_board/frontend" -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "Starting Streamlit App..."
streamlit run app.py

# When Streamlit closes, stop the frontend
Stop-Process -Id $frontendProcess.Id
